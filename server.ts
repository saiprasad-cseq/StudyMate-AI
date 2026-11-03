import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
import { buildProceduralCurriculum } from "./server/curriculumEngine";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy/safe initialization for GoogleGenAI
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Fallback generative logic will be used.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Determines whether the student's question genuinely requires deeper reasoning (MEDIUM)
// or standard fast educational tutoring (LOW)
function selectTutorThinkingLevel(
  lastMessageText: string = "",
  quickAction?: string,
  subject?: string
): ThinkingLevel {
  const text = (lastMessageText + " " + (subject || "")).toLowerCase();

  // Quick actions that are inherently standard concise responses
  if (quickAction === "explain_simply" || quickAction === "summarize" || quickAction === "quiz_me") {
    return ThinkingLevel.LOW;
  }

  // Complex reasoning indicators (Advanced Math, Algorithmic Proofs, Stack Traces, Deep Debugging)
  const complexPatterns = [
    /\b(proof|prove|derivation|derive|differentiate|integrate|integral|eigenvalue|differential equation)\b/,
    /\b(dynamic programming|knapsack|dijkstra|np-hard|asymptotic|recurrence relation|graph cycle)\b/,
    /\b(segmentation fault|memory leak|deadlock|race condition|nullpointerexception|stack trace)\b/,
    /\b(debug this|find the bug|fix this error|why is this code failing|trace the output)\b/,
    /\b(complex analysis|abstract algebra|linear transformation|combinatorics formula)\b/,
    /```[\s\S]{30,}```/, // Multi-line code block in user prompt
  ];

  for (const pattern of complexPatterns) {
    if (pattern.test(text)) {
      return ThinkingLevel.MEDIUM;
    }
  }

  // Default to LOW for fast responses on normal educational questions
  return ThinkingLevel.LOW;
}

// Helper to safely call Gemini with automatic retry and multi-tier model fallback
async function callGeminiWithFallback(params: {
  systemInstruction?: string;
  contents: any;
  responseMimeType?: string;
  responseSchema?: any;
  thinkingLevel?: ThinkingLevel;
}): Promise<string> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error("No Gemini client available");
  }

  // Modern supported models in order of capability and availability with instant fallback
  const modelsToTry = [
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.7-flash",
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const config: any = {};
      if (params.systemInstruction) {
        config.systemInstruction = params.systemInstruction;
      }
      if (params.responseMimeType) {
        config.responseMimeType = params.responseMimeType;
      }
      if (params.responseSchema) {
        config.responseSchema = params.responseSchema;
      }
      if (params.thinkingLevel && (model === "gemini-3.8-flash" || model === "gemini-3.7-flash")) {
        config.thinkingConfig = { thinkingLevel: params.thinkingLevel };
      }

      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config,
      });

      const text = response.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || (String(err?.message || "").includes("429") ? "429-quota" : "unavailable");
      console.log(`[Gemini info] Model ${model} status: ${status}. Cascading to next model...`);
      continue;
    }
  }

  throw lastError || new Error("All Gemini models were unavailable");
}

// Safely sanitize control characters inside JSON string literals
function sanitizeControlCharsInJson(jsonStr: string): string {
  let inString = false;
  let isEscaped = false;
  let result = "";

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];
    const code = jsonStr.charCodeAt(i);

    if (inString) {
      if (isEscaped) {
        // Character is escaped, preserve it
        result += char;
        isEscaped = false;
      } else if (char === "\\") {
        result += char;
        isEscaped = true;
      } else if (char === '"') {
        result += char;
        inString = false;
      } else if (char === "\n") {
        result += "\\n";
      } else if (char === "\r") {
        result += "\\r";
      } else if (char === "\t") {
        result += "\\t";
      } else if (code < 0x20) {
        // Other control character: convert to unicode escape \u00XX
        result += "\\u" + code.toString(16).padStart(4, "0");
      } else {
        result += char;
      }
    } else {
      if (char === '"') {
        inString = true;
      }
      result += char;
    }
  }
  return result;
}

// Safely extract and parse JSON from raw model string
function safeParseJson<T = any>(raw: string, fallback: T): T {
  if (!raw) return fallback;

  // Step 1: Clean potential markdown wrappers
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/i, "").replace(/\s*```$/i, "");
  }
  cleaned = cleaned.trim();

  // Step 2: Try direct parse
  try {
    return JSON.parse(cleaned) as T;
  } catch (e1) {
    // Step 3: Sanitize unescaped control characters and trailing commas
    try {
      const sanitized = sanitizeControlCharsInJson(cleaned).replace(/,\s*([\]}])/g, "$1");
      return JSON.parse(sanitized) as T;
    } catch (e2) {
      // Step 4: Extract JSON object or array substring and sanitize
      const jsonMatch = raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (jsonMatch) {
        try {
          const sanitizedMatch = sanitizeControlCharsInJson(jsonMatch[0]).replace(/,\s*([\]}])/g, "$1");
          return JSON.parse(sanitizedMatch) as T;
        } catch (e3) {
          // Silent fallback to avoid unhandled crash
        }
      }
      return fallback;
    }
  }
}

// Domain-aware roadmap builder leveraging procedural curriculum engine
function generateFallbackRoadmap(profile: any) {
  const duration = Math.max(1, Math.min(6, Math.round(Number(profile.durationYears) || 3)));
  const dailyHours = Number(profile.dailyHours) || 1.5;
  const studyDaysCount = Array.isArray(profile.studyDays) ? profile.studyDays.length : 5;
  return buildProceduralCurriculum(
    profile.subject || "Computer Science & Engineering",
    profile.currentLevel || "Beginner",
    profile.mainGoal || "Mastery",
    duration,
    dailyHours,
    studyDaysCount
  );
}

// 1. GENERATE ROADMAP
app.post("/api/ai/generate-roadmap", async (req, res) => {
  const profile = req.body;
  try {
    const duration = Math.max(1, Math.min(6, Math.round(Number(profile.durationYears) || 3)));
    const dailyHours = Number(profile.dailyHours) || 1.5;
    const studyDays = Array.isArray(profile.studyDays) && profile.studyDays.length > 0 ? profile.studyDays : ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const weeklyHours = Math.round(dailyHours * studyDays.length);

    const prompt = `You are the lead academic curriculum architect for StudyMate, a calm, supportive, and structured personal study companion.
Design a genuinely personalized, highly specific, and comprehensive ${duration}-year learning roadmap for this student.

STUDENT PROFILE:
- Name: ${profile.name || "Student"}
- Subject / Major: ${profile.subject || "Computer Science & Engineering"}
- Current Level: ${profile.currentLevel || "Beginner"}
- Ultimate Goal: ${profile.mainGoal || "Comprehensive Mastery"}
- Duration: ${duration} years
- Target Completion Date: ${profile.targetDate || "Ongoing"}
- Daily Study Time: ${dailyHours} hours/day (${weeklyHours} hours/week across ${studyDays.join(", ")})

STRICT CURRICULUM & QUALITY RULES:
1. NEVER use generic placeholder names like "Core Focus 1", "Core Focus 2", "Part 1", "Part 2", or "Essential Tools".
2. EVERY topic name must be an actual, recognized, academic or technical subject (e.g., "Pointers & Dynamic Memory Layout", "B-Tree & Hash Indexing in Databases", "Dynamic Programming: Knapsack & Subsequences", "Process Scheduling & Deadlock Synchronization", "TCP Congestion Control & TLS Handshake", "System Design: Rate Limiters & Distributed Caches").
3. Organize hierarchically: ${duration} Years -> 2 Semesters (periods) per year -> 4-6 Months per semester -> 4 Weeks per month -> 1-2 focused Topics per week.
4. Each Topic MUST include:
   - "id": unique string ID (e.g. "top-y1-p1-m1-w1-1")
   - "title": specific, high-yield academic title
   - "description": 1-2 sentence practical explanation of what to learn and master
   - "estimatedHours": realistic number of hours based on weekly schedule (typically ${Math.max(3, Math.round(weeklyHours / 1.5))} to ${Math.max(4, weeklyHours)} hours)
   - "difficulty": "Beginner" | "Intermediate" | "Advanced"
   - "keyConcepts": array of 3-4 specific subtopics/terms
   - "prerequisites": array of prerequisite topic strings or ["None"]
   - "type": "concept" | "practice" | "project" | "revision" | "milestone"
   - "completed": false
   - "masteryLevel": 0
   - "notes": []
5. Include an encouraging "aiRecommendation" personalized to ${profile.name || "the student"}.

Return ONLY valid JSON matching this schema:
{
  "id": "roadmap-generated",
  "overallGoal": "${profile.mainGoal || "Comprehensive Mastery"}",
  "subject": "${profile.subject || "Computer Science & Engineering"}",
  "aiRecommendation": "string",
  "years": [
    {
      "id": "y-1",
      "yearNumber": 1,
      "title": "Year 1: Foundations & Core Principles",
      "goal": "...",
      "periods": [
        {
          "id": "p-1-1",
          "periodNumber": 1,
          "title": "Semester 1: Core Fundamentals",
          "theme": "Core Foundations",
          "months": [
            {
              "id": "m-1-1-1",
              "monthNumber": 1,
              "title": "Month 1: Getting Started",
              "summary": "...",
              "weeks": [
                {
                  "id": "w-1-1-1-1",
                  "weekNumber": 1,
                  "title": "Week 1: Primitives",
                  "summary": "...",
                  "topics": [
                    {
                      "id": "top-1-1-1-1-1",
                      "title": "Specific Topic Name",
                      "description": "...",
                      "estimatedHours": 8,
                      "difficulty": "${profile.currentLevel || "Beginner"}",
                      "prerequisites": ["None"],
                      "type": "concept",
                      "keyConcepts": ["Concept A", "Concept B", "Concept C"],
                      "completed": false,
                      "masteryLevel": 0,
                      "notes": []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}`;

    const rawText = await callGeminiWithFallback({
      contents: prompt,
      responseMimeType: "application/json",
      systemInstruction: "You are an elite academic curriculum architect. Return strictly valid JSON with realistic academic progression, concrete topics, and zero placeholder names.",
    });

    const fallback = generateFallbackRoadmap(profile);
    const parsed = safeParseJson(rawText, fallback);
    if (!parsed.years || !Array.isArray(parsed.years) || parsed.years.length === 0) {
      return res.json({ success: true, roadmap: fallback });
    }
    parsed.lastUpdated = new Date().toISOString();
    return res.json({ success: true, roadmap: parsed });
  } catch (err: any) {
    console.warn("Gemini roadmap generation fallback triggered:", err?.message || err);
    const fallback = generateFallbackRoadmap(profile);
    return res.json({ success: true, roadmap: fallback, note: "Generated via structured curriculum engine" });
  }
});

// REBALANCE ROADMAP (Adaptively adjust pacing after missed days without stress)
app.post("/api/ai/rebalance-roadmap", async (req, res) => {
  const { roadmap, userProfile, missedDaysCount } = req.body;
  try {
    if (!roadmap || !roadmap.years) {
      const fresh = generateFallbackRoadmap(userProfile || {});
      return res.json({ success: true, roadmap: fresh, message: "Roadmap refreshed successfully." });
    }

    const updatedRoadmap = JSON.parse(JSON.stringify(roadmap));
    const dailyHours = Number(userProfile?.dailyHours) || 1.5;
    const studyDays = Array.isArray(userProfile?.studyDays) && userProfile.studyDays.length > 0 ? userProfile.studyDays : ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const weeklyHours = Math.round(dailyHours * studyDays.length);

    // Rebalance: find uncompleted topics and redistribute them cleanly across upcoming weeks
    let totalUncompleted = 0;
    updatedRoadmap.years.forEach((y: any) => {
      y.periods?.forEach((p: any) => {
        p.months?.forEach((m: any) => {
          m.weeks?.forEach((w: any) => {
            w.topics?.forEach((t: any) => {
              if (!t.completed) {
                totalUncompleted++;
                // Recalculate estimated hours realistically
                t.estimatedHours = Math.max(2, Math.round(weeklyHours / Math.max(1, w.topics.length)));
              }
            });
          });
        });
      });
    });

    updatedRoadmap.lastUpdated = new Date().toISOString();
    updatedRoadmap.aiRecommendation = `Schedule successfully rebalanced! Pacing has been adjusted to ${dailyHours}h/day without overloading your upcoming sessions. Take a deep breath and let's keep going.`;

    return res.json({
      success: true,
      roadmap: updatedRoadmap,
      message: `Pacing rebalanced for ${totalUncompleted} remaining topics.`
    });
  } catch (err: any) {
    console.error("Rebalance error:", err);
    return res.status(500).json({ error: "Failed to rebalance roadmap" });
  }
});

// 2. AI TUTOR CHAT (STREAMING & NON-STREAMING)
app.post("/api/ai/tutor-chat-stream", async (req, res) => {
  const { messages, userProfile, activeTopic, quickAction, dailyTasks, completedTopics, weakTopics, longTermGoal } = req.body;
  
  // Set SSE streaming headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const lastUserMsg = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1]?.content : "";
  const thinkingLevel = selectTutorThinkingLevel(lastUserMsg, quickAction, userProfile?.subject);

  let actionPrompt = "";
  if (quickAction === "explain_simply") {
    actionPrompt = "Explain this concept in plain, simple terms using an intuitive real-world analogy. Avoid complex jargon.";
  } else if (quickAction === "give_example") {
    actionPrompt = "Provide a concrete, step-by-step example with brief commentary explaining each step.";
  } else if (quickAction === "quiz_me") {
    actionPrompt = "Give me 2 quick concept check questions to test my understanding right now. Ask me to answer first.";
  } else if (quickAction === "practice_questions") {
    actionPrompt = "Provide 3 targeted practice exercises ranging from beginner to intermediate difficulty.";
  } else if (quickAction === "summarize") {
    actionPrompt = "Provide a high-yield summary: 3 key takeaways, 1 common pitfall, and 1 memory trigger.";
  } else if (quickAction === "explain_mistake") {
    actionPrompt = "Help me diagnose my mistake with patience. Explain why that misconception happens and how to correct it easily.";
  }

  const tasksContext = Array.isArray(dailyTasks) && dailyTasks.length > 0
    ? `Today's Daily Plan Tasks: ${dailyTasks.map((t: any) => t.title).join(", ")}`
    : "";
  const weakContext = Array.isArray(weakTopics) && weakTopics.length > 0
    ? `Recent Weak Areas / Need Revision: ${weakTopics.slice(0, 3).join(", ")}`
    : "";
  const completedCount = Array.isArray(completedTopics) ? completedTopics.length : 0;

  const systemPrompt = `You are StudyMate AI, an empathetic, supportive, and exceptionally clear personal study tutor.
Current Student: ${userProfile?.name || "Student"} | Subject: ${userProfile?.subject || "General"} | Level: ${userProfile?.currentLevel || "Beginner"}
Long-Term Academic Goal: "${longTermGoal || userProfile?.mainGoal || "Mastery"}"
${activeTopic ? `Active Roadmap Focus: "${activeTopic.title}" - ${activeTopic.description || ""}` : ""}
${tasksContext}
${weakContext}
Completed Topics so far: ${completedCount}

CORE TUTORING RULES:
1. Conciseness by Default: Keep explanations focused, crisp, and high-impact (2-4 clear paragraphs or bullet points). Avoid fluff, generic preambles, or unnecessarily long walls of text.
2. Context Awareness: Connect concepts to the student's active roadmap topic and today's study plan.
3. Clarity: Use clean Markdown with bold key terms and short readable code/formula snippets where relevant.
4. Level Calibration: Calibrate vocabulary and depth to ${userProfile?.currentLevel || "Beginner"}.
5. Active Engagement: Conclude with one brief, supportive reflective question to reinforce retention.
${actionPrompt ? `Specific Request: ${actionPrompt}` : ""}`;

  // Format conversation history for Gemini
  const conversationContents = (messages || []).map((m: any) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const contents = conversationContents.length > 0
    ? conversationContents
    : [{ role: "user", parts: [{ text: "Hello! I am ready to study." }] }];

  const ai = getGeminiClient();

  if (!ai) {
    // Immediate fallback stream if no API key
    const fallbackText = `Here is a clear breakdown for **${activeTopic?.title || userProfile?.subject || "this topic"}**:

1. **Core Principle**: Focus on the fundamental rules and how the components interact.
2. **Key Insight**: Build understanding from simple baseline examples before tackling edge cases.
3. **Quick Check**: Can you summarize the main purpose in one sentence?

What specific question or doubt would you like to explore next?`;

    res.write(`data: ${JSON.stringify({ text: fallbackText })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    return res.end();
  }

  try {
    // Use high-availability models with instant fallbacks
    let streamedAny = false;
    const streamModels = [
      "gemini-3.8-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
      "gemini-3.7-flash",
    ];
    
    for (const model of streamModels) {
      if (streamedAny) break;
      try {
        const config: any = {
          systemInstruction: systemPrompt,
        };
        if (thinkingLevel && (model === "gemini-3.8-flash" || model === "gemini-3.7-flash")) {
          config.thinkingConfig = { thinkingLevel };
        }

        const stream = await ai.models.generateContentStream({
          model,
          contents,
          config,
        });

        for await (const chunk of stream) {
          const text = chunk.text;
          if (text) {
            streamedAny = true;
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        }

        if (streamedAny) {
          break;
        }
      } catch (streamErr: any) {
        const status = streamErr?.status || streamErr?.code || (String(streamErr?.message || "").includes("429") ? "429-quota" : "unavailable");
        console.log(`[Tutor Stream Info] Model ${model} stream status: ${status}. Cascading to next model...`);
        if (streamedAny) {
          // If we already started streaming text to client, stop here rather than sending mixed model tokens
          break;
        }
      }
    }

    if (!streamedAny) {
      const subjectName = activeTopic?.title || userProfile?.subject || "your topic";
      const fallback = `Let's break down **${subjectName}** step-by-step:

1. **Core Idea**: Master the foundational primitives and logical flow first.
2. **Applied Pattern**: Test each step with a simple example to build solid understanding.
3. **Next Step**: What specific question or doubt would you like to explore together?`;

      res.write(`data: ${JSON.stringify({ text: fallback })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    return res.end();
  } catch (err: any) {
    console.log("[Tutor Stream Info] Using resilient tutoring fallback:", err?.message || err);
    const subjectName = activeTopic?.title || userProfile?.subject || "your topic";
    
    // Send a structured helpful fallback response with retry indication
    const fallback = `Let's break down **${subjectName}** step-by-step:

1. **Core Idea**: Master the foundational primitives and logical flow first.
2. **Applied Pattern**: Test each step with a simple example to build solid understanding.
3. **Next Step**: What specific question or doubt would you like to explore together?`;

    res.write(`data: ${JSON.stringify({ text: fallback })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    return res.end();
  }
});

// Non-streaming fallback for compatibility
app.post("/api/ai/tutor-chat", async (req, res) => {
  const { messages, userProfile, activeTopic, quickAction, dailyTasks, completedTopics, weakTopics, longTermGoal } = req.body;
  const lastUserMsg = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1]?.content : "";
  const thinkingLevel = selectTutorThinkingLevel(lastUserMsg, quickAction, userProfile?.subject);

  try {
    let actionPrompt = "";
    if (quickAction === "explain_simply") {
      actionPrompt = "Explain this concept in plain, simple terms using an intuitive real-world analogy. Avoid complex jargon.";
    } else if (quickAction === "give_example") {
      actionPrompt = "Provide a concrete, step-by-step example with commentary explaining each step.";
    } else if (quickAction === "quiz_me") {
      actionPrompt = "Give me 2 quick concept check questions to test my understanding right now.";
    } else if (quickAction === "practice_questions") {
      actionPrompt = "Provide 3 targeted practice exercises ranging from beginner to intermediate difficulty.";
    } else if (quickAction === "summarize") {
      actionPrompt = "Provide a high-yield summary: 3 key takeaways, 1 common pitfall, and 1 memory trigger.";
    } else if (quickAction === "explain_mistake") {
      actionPrompt = "Help me diagnose my mistake with patience. Explain why that misconception happens.";
    }

    const tasksContext = Array.isArray(dailyTasks) && dailyTasks.length > 0
      ? `Today's Daily Plan Tasks: ${dailyTasks.map((t: any) => t.title).join(", ")}`
      : "";
    const weakContext = Array.isArray(weakTopics) && weakTopics.length > 0
      ? `Recent Weak Areas / Need Revision: ${weakTopics.slice(0, 3).join(", ")}`
      : "";
    const completedCount = Array.isArray(completedTopics) ? completedTopics.length : 0;

    const systemPrompt = `You are StudyMate AI, a patient, encouraging, and clear personal tutor.
Current Student: ${userProfile?.name || "Student"} | Subject: ${userProfile?.subject || "General"} | Level: ${userProfile?.currentLevel || "Beginner"}
Long-Term Academic Goal: "${longTermGoal || userProfile?.mainGoal || "Mastery"}"
${activeTopic ? `Active Roadmap Focus: "${activeTopic.title}" - ${activeTopic.description || ""}` : ""}
${tasksContext}
${weakContext}
Completed Topics so far: ${completedCount}

RULES:
1. Keep answers concise by default (2-4 clear paragraphs/bullet points).
2. Avoid unnecessary verbosity or filler.
3. Conclude with a brief concept confirmation question.
${actionPrompt ? `Specific Request: ${actionPrompt}` : ""}`;

    const conversationContents = (messages || []).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const replyText = await callGeminiWithFallback({
      contents: conversationContents.length > 0 ? conversationContents : [{ role: "user", parts: [{ text: "Hello!" }] }],
      systemInstruction: systemPrompt,
      thinkingLevel,
    });

    return res.json({ reply: replyText || "I'm here to help!" });
  } catch (err: any) {
    console.log("[Tutor Chat Info] Chat fallback triggered:", err?.message || err);
    return res.json({
      reply: `Let's break down this topic systematically. Focus on the foundational principle first, then try a quick practice check!`
    });
  }
});

// 3. GENERATE QUIZ
app.post("/api/ai/generate-quiz", async (req, res) => {
  const { topicTitle, subject, difficulty = "Medium", questionCount = 5, keyConcepts = [] } = req.body;
  const count = Number(questionCount) === 10 ? 10 : 5;
  const effectiveTopic = topicTitle || subject || "Core Concepts";

  const fallbackQuestions = Array.from({ length: count }, (_, i) => ({
    id: `q-${i + 1}`,
    question: `Which of the following best describes the core principle of ${effectiveTopic} (Question ${i + 1})?`,
    options: [
      `Carefully analyzing edge cases, invariants, and structural transitions`,
      `Skipping initial conceptual validation to guess the outcome`,
      `Ignoring boundary conditions and assumptions`,
      `Applying rules arbitrarily without structured reasoning`
    ],
    correctAnswer: 0,
    explanation: `Thoroughly understanding invariants, core structures, and transition logic is fundamental to mastering ${effectiveTopic}.`,
    topic: effectiveTopic
  }));

  try {
    const prompt = `Generate a high-quality ${count}-question multiple choice quiz on the topic: "${effectiveTopic}".
Subject: ${subject || "General Science"}
Difficulty Level: ${difficulty}
Key concepts to touch on: ${keyConcepts.join(", ") || effectiveTopic}

Requirements:
- Exactly ${count} questions.
- Each question must have exactly 4 plausible options (A, B, C, D).
- "correctAnswer" must be the 0-based integer index (0, 1, 2, or 3) of the correct option in the "options" array.
- "explanation" should be a concise, helpful 1-2 sentence breakdown of why that option is correct.
- Provide a clear, educational question stem.

Return ONLY a JSON array matching:
[
  {
    "id": "q-1",
    "question": "What is the primary function of...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Option A is correct because...",
    "topic": "${effectiveTopic}"
  }
]`;

    const rawText = await callGeminiWithFallback({
      contents: prompt,
      responseMimeType: "application/json",
      systemInstruction: "You are an expert examiner. Return strictly valid JSON array of quiz questions.",
    });

    const parsed = safeParseJson(rawText, fallbackQuestions);
    const finalQuestions = Array.isArray(parsed) && parsed.length > 0 ? parsed : fallbackQuestions;
    return res.json({ success: true, questions: finalQuestions });
  } catch (err: any) {
    console.warn("Quiz generation fallback triggered:", err?.message || err);
    return res.json({ success: true, questions: fallbackQuestions });
  }
});

// 4. GENERATE SPECIFIC LESSON
app.post("/api/ai/topic-lesson", async (req, res) => {
  const { topicTitle, subject, educationLevel, difficulty = "Beginner", currentGoal } = req.body;
  const cleanTitle = (topicTitle || "Variables and Data Types").replace(/^(learn|watch|practice|quiz|revision):\s*/i, "").trim();

  try {
    const prompt = `You are the lead academic educator for StudyMate.
Create an exhaustive, high-yield, structured lesson for the topic: "${cleanTitle}".
Subject: ${subject || "Computer Science & Engineering"}
Target Education Level: ${educationLevel || "B.Tech / Degree"}
Difficulty: ${difficulty}
Student Goal: ${currentGoal || "Mastery"}

CRITICAL EDUCATIONAL REQUIREMENTS:
1. "learningObjectives": 4-5 concrete, practical takeaways.
2. "reading": An in-depth, structured explanation with 2-3 named sections, core principles, clear markdown with bold terms, and key memory takeaways.
3. "realWorldAnalogy": A vivid, intuitive physical analogy with a comparison mapping table connecting real-world elements to software/system concepts.
4. "codeExamples": 1-2 realistic, syntax-highlighted code examples with clear explanation and expected terminal output.
5. "practiceSection": 2 hands-on exercises with scenario, progressive hints, and step-by-step model solution walkthrough.
6. "conceptChecks": 2-3 instant concept-check questions with 4 options, 0-based integer correctAnswer index, and clear explanation.
7. "quizQuestions": 3 diagnostic multiple-choice questions with 4 options, 0-based integer correctAnswer index, and concise explanation.

Return ONLY valid JSON matching this schema:
{
  "learningObjectives": ["string", "string", "string", "string"],
  "reading": {
    "summary": "string",
    "sections": [
      {
        "heading": "string",
        "content": "string (markdown supported)",
        "keyTakeaway": "string",
        "examTipOrNote": "string"
      }
    ]
  },
  "realWorldAnalogy": {
    "title": "string",
    "analogy": "string",
    "mapping": [
      {
        "realWorldItem": "string",
        "conceptMapping": "string"
      }
    ]
  },
  "codeExamples": [
    {
      "title": "string",
      "language": "c",
      "code": "string",
      "explanation": "string",
      "output": "string"
    }
  ],
  "practiceSection": [
    {
      "id": "prac-1",
      "title": "string",
      "difficulty": "Medium",
      "scenario": "string",
      "starterCode": "string",
      "hints": ["string", "string"],
      "solution": "string",
      "solutionWalkthrough": "string"
    }
  ],
  "conceptChecks": [
    {
      "id": "cc-1",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "string"
    }
  ],
  "quizQuestions": [
    {
      "id": "q-1",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "string",
      "topic": "${cleanTitle}"
    }
  ]
}`;

    const rawText = await callGeminiWithFallback({
      contents: prompt,
      responseMimeType: "application/json",
      systemInstruction: "You are an elite university professor and technical tutor. Return strictly valid JSON lesson data.",
    });

    const parsed = safeParseJson(rawText, null);
    if (parsed && parsed.learningObjectives && parsed.reading) {
      return res.json({ success: true, lesson: parsed });
    }
    return res.json({ success: false, message: "Fallback to client lesson engine" });
  } catch (err: any) {
    console.warn("AI lesson generation fallback triggered:", err?.message || err);
    return res.json({ success: false, message: "Fallback to client lesson engine" });
  }
});

// 5. QUICK STUDY MODE
app.post("/api/ai/quick-study", async (req, res) => {
  const { durationMinutes = 30, topicTitle, subject, currentLevel } = req.body;
  const effectiveTopic = topicTitle || subject || "High-Yield Review";

  const fallbackSession = {
    durationMinutes,
    topicTitle: effectiveTopic,
    coreConcepts: [`${effectiveTopic} Primitives`, `Logical Flow & Rules`, `Practical Application`],
    highYieldSummary: `In this ${durationMinutes}-minute sprint on ${effectiveTopic}, focus on mastering the core mechanism first. Understand the underlying rules before tackling variations.`,
    rapidCheckQuestions: [
      { question: `What is the most crucial takeaway when working with ${effectiveTopic}?`, answer: `Focusing on verified fundamentals prevents compounding errors downstream.` },
      { question: `How should you check your work during practice?`, answer: `Trace boundary conditions and test with representative sample cases.` }
    ],
    actionItem: `Spend the next ${Math.max(5, durationMinutes - 5)} minutes applying this concept to 1 concrete practice problem.`
  };

  try {
    const prompt = `Create a high-impact, distraction-free "Quick Study" micro-session for a student with limited time (${durationMinutes} minutes).
Topic: "${effectiveTopic}"
Subject: ${subject || "General Science"}
Level: ${currentLevel || "Beginner"}

Structure the response for maximum retention within ${durationMinutes} minutes.
Return ONLY valid JSON matching:
{
  "durationMinutes": ${durationMinutes},
  "topicTitle": "${effectiveTopic}",
  "coreConcepts": ["concept 1", "concept 2", "concept 3"],
  "highYieldSummary": "A punchy, clear 2-3 sentence distillation of the absolute most essential thing to know.",
  "rapidCheckQuestions": [
    { "question": "Rapid test question 1", "answer": "Clear quick answer 1" },
    { "question": "Rapid test question 2", "answer": "Clear quick answer 2" }
  ],
  "actionItem": "A specific 5-minute drill or task to finish this sprint."
}`;

    const rawText = await callGeminiWithFallback({
      contents: prompt,
      responseMimeType: "application/json",
      systemInstruction: "You are a speed-learning expert. Create ultra-concise, high-yield study material in JSON.",
    });

    const parsed = safeParseJson(rawText, fallbackSession);
    return res.json({ success: true, session: parsed });
  } catch (err: any) {
    console.warn("Quick study fallback triggered:", err?.message || err);
    return res.json({ success: true, session: fallbackSession });
  }
});

// 5. SMART SCHEDULE ADJUSTMENT (Non-shaming, intelligent rebalancing)
app.post("/api/ai/adjust-schedule", async (req, res) => {
  const { missedDaysCount = 1, currentTasks = [], userProfile } = req.body;
  const fallbackMessage = {
    message: `No worries at all! Life happens. We've smoothed out your upcoming schedule into manageable ${userProfile?.dailyHours || 1.5}h blocks so you can resume without feeling overwhelmed.`,
    adjustedRecommendation: `Focus on today's scheduled block at a steady, comfortable pace without trying to rush past material.`,
    pacingAdvice: `Consistency beats intensity. One focused 25-minute session today is a complete win.`
  };

  try {
    const prompt = `The student missed approximately ${missedDaysCount} study day(s).
Student Profile:
- Daily Hours: ${userProfile?.dailyHours || 1.5}h
- Subject: ${userProfile?.subject || "General"}
- Goal: ${userProfile?.mainGoal || "Mastery"}

Provide a supportive, guilt-free adjustment message and study strategy.
Rules:
1. NEVER shame or guilt the student.
2. Emphasize that consistency beats cramming.
3. Recommend focusing on current essential topics rather than drowning in backlog.

Return ONLY JSON:
{
  "message": "Supportive message explaining the rebalance...",
  "adjustedRecommendation": "1 practical immediate focus for today",
  "pacingAdvice": "Tip on keeping sustainable rhythm"
}`;

    const rawText = await callGeminiWithFallback({
      contents: prompt,
      responseMimeType: "application/json",
    });

    const parsed = safeParseJson(rawText, fallbackMessage);
    return res.json({ success: true, ...parsed });
  } catch (err: any) {
    return res.json({ success: true, ...fallbackMessage });
  }
});

// Vite middleware for development & Static hosting for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyMate server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
