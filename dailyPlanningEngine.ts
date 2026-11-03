import { UserProfile, Roadmap, RoadmapTask, RoadmapTopic, StudySession, QuizResult } from '../types';

export interface DailyPlanningContext {
  profile: UserProfile;
  roadmap: Roadmap;
  tasks: RoadmapTask[];
  sessions: StudySession[];
  quizzes: QuizResult[];
  availableMinutes?: number;
}

export interface GeneratedDayPlan {
  date: string;
  dayOfWeek: string;
  dayGoalMinutes: number;
  activeTopic: RoadmapTopic;
  tasks: RoadmapTask[];
  revisionTopic?: RoadmapTopic | null;
  weakTopics: string[];
  recommendation: string;
}

// Days of week
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Intelligent Daily Planning Engine
 * Generates an adaptive, realistic, day-to-day study plan based on:
 * - Student's long-term goal & subject
 * - Current roadmap position and topic
 * - Completed topics history & spaced repetition
 * - Weak topics identified from quizzes and sessions
 * - Available study hours & day of week
 * - Missed or completed yesterday items
 */
export function generateDailyPlan(context: DailyPlanningContext): GeneratedDayPlan {
  const { profile, roadmap, sessions, quizzes, availableMinutes } = context;
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const dayOfWeek = DAYS[now.getDay()];

  // 1. Gather all roadmap topics in order
  const allTopics: RoadmapTopic[] = [];
  if (roadmap?.years) {
    roadmap.years.forEach((y) =>
      y.periods?.forEach((p) =>
        p.months?.forEach((m) =>
          m.weeks?.forEach((w) => w.topics?.forEach((t) => allTopics.push(t)))
        )
      )
    );
  }

  const completedTopics = allTopics.filter((t) => t.completed);
  const uncompletedTopics = allTopics.filter((t) => !t.completed);

  // 2. Identify active topic
  const activeTopic: RoadmapTopic = uncompletedTopics[0] || allTopics[allTopics.length - 1] || {
    id: 'topic-default',
    title: `${profile.subject || 'Computer Science'} Fundamentals`,
    description: `Core principles and structured logic in ${profile.subject}`,
    estimatedHours: 8,
    difficulty: profile.currentLevel || 'Beginner',
    keyConcepts: ['Foundational Concepts', 'Syntax & Rules', 'Problem Solving'],
    completed: false,
    masteryLevel: 0,
    notes: []
  };

  // Next topic if user is advancing
  const nextTopic: RoadmapTopic | undefined = uncompletedTopics[1];

  // 3. Identify weak areas from quizzes
  const weakTopicTitles = new Set<string>();
  quizzes.forEach((q) => {
    if (q.score / (q.total || 5) < 0.7) {
      weakTopicTitles.add(q.topic);
    }
    if (Array.isArray(q.weakAreas)) {
      q.weakAreas.forEach((w) => weakTopicTitles.add(w));
    }
  });

  const weakTopicObjects = allTopics.filter((t) =>
    Array.from(weakTopicTitles).some((w) => t.title.toLowerCase().includes(w.toLowerCase()))
  );

  // 4. Determine Spaced Repetition / Revision candidate
  // Find a previously completed topic that hasn't been revised recently
  let revisionCandidate: RoadmapTopic | null = null;
  if (weakTopicObjects.length > 0) {
    revisionCandidate = weakTopicObjects[0];
  } else if (completedTopics.length > 0) {
    // Pick the most relevant completed topic (or the one completed longest ago)
    revisionCandidate = completedTopics[completedTopics.length - 1];
  }

  // 5. Calculate daily study minutes
  const targetDailyMinutes = availableMinutes !== undefined
    ? availableMinutes
    : Math.round((Number(profile.dailyHours) || 1.5) * 60);

  // Check recent session activity (what was completed yesterday / today)
  const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const yesterdaySessions = sessions.filter((s) => s.timestamp.startsWith(yesterdayStr));
  const yesterdayMinutes = yesterdaySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const wasYesterdayMissed = yesterdaySessions.length === 0;

  // 6. Generate adaptive tasks based on time & progress
  const tasks: RoadmapTask[] = [];

  const mainConceptName = activeTopic.keyConcepts?.[0] || activeTopic.title;
  const secondaryConcept = activeTopic.keyConcepts?.[1] || 'Applied Logic';
  const topicShortName = activeTopic.title.split(':')[0].trim();

  if (targetDailyMinutes <= 20) {
    // Ultra-quick 15-20 min high-yield session
    tasks.push({
      id: `task-${todayStr}-learn-quick`,
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      title: `Learn: ${topicShortName} — ${mainConceptName}`,
      estimatedMinutes: Math.max(10, Math.round(targetDailyMinutes * 0.7)),
      completed: false,
      date: todayStr,
      notes: `High-yield focus on ${mainConceptName}`
    });
    tasks.push({
      id: `task-${todayStr}-quiz-quick`,
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      title: `Quiz: 3 Quick Concept Check Questions`,
      estimatedMinutes: Math.max(5, Math.round(targetDailyMinutes * 0.3)),
      completed: false,
      date: todayStr,
      notes: `Rapid comprehension check`
    });
  } else if (targetDailyMinutes <= 45) {
    // 30 - 45 min compact session (Learn + Practice + Quick Quiz)
    const learnMins = Math.round(targetDailyMinutes * 0.5);
    const practiceMins = Math.round(targetDailyMinutes * 0.35);
    const quizMins = Math.max(5, targetDailyMinutes - learnMins - practiceMins);

    tasks.push({
      id: `task-${todayStr}-learn`,
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      title: `Learn: ${topicShortName} — ${mainConceptName}`,
      estimatedMinutes: learnMins,
      completed: false,
      date: todayStr,
      notes: `Master the core theory and syntax of ${mainConceptName}`
    });

    tasks.push({
      id: `task-${todayStr}-practice`,
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      title: `Practice: 5 Targeted Questions & Code Tracing`,
      estimatedMinutes: practiceMins,
      completed: false,
      date: todayStr,
      notes: `Hands-on problem solving on ${secondaryConcept}`
    });

    tasks.push({
      id: `task-${todayStr}-quiz`,
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      title: `Quiz: 5 Rapid Diagnostic Questions`,
      estimatedMinutes: quizMins,
      completed: false,
      date: todayStr,
      notes: `Test retention without memorization`
    });
  } else {
    // Standard to Deep Session (1 hour to 2+ hours)
    // Structure:
    // 1. Learn: [specific topic] — [estimated time]
    // 2. Practice: [specific practice] — [estimated time]
    // 3. Quiz: [number of questions] — [estimated time]
    // 4. Revision: [specific previous topic] — [estimated time]

    const learnTime = Math.round(targetDailyMinutes * 0.45); // e.g. 40 min out of 90 min
    const practiceTime = Math.round(targetDailyMinutes * 0.30); // e.g. 25-30 min
    const quizTime = Math.round(targetDailyMinutes * 0.12); // e.g. 10 min
    const revisionTime = Math.max(10, targetDailyMinutes - learnTime - practiceTime - quizTime); // e.g. 10-15 min

    const practiceCount = targetDailyMinutes >= 90 ? '8 Hands-on Exercises' : '5 Practical Problems';
    const quizCount = targetDailyMinutes >= 90 ? '5 In-Depth Questions' : '5 Quick Questions';

    tasks.push({
      id: `task-${todayStr}-learn`,
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      title: `Learn: ${topicShortName} — ${mainConceptName}`,
      estimatedMinutes: learnTime,
      completed: false,
      date: todayStr,
      notes: `Deep dive into ${mainConceptName} & ${secondaryConcept}`
    });

    tasks.push({
      id: `task-${todayStr}-practice`,
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      title: `Practice: ${practiceCount} & Application`,
      estimatedMinutes: practiceTime,
      completed: false,
      date: todayStr,
      notes: `Practical problem solving on ${activeTopic.title}`
    });

    tasks.push({
      id: `task-${todayStr}-quiz`,
      topicId: activeTopic.id,
      topicTitle: activeTopic.title,
      title: `Quiz: ${quizCount}`,
      estimatedMinutes: quizTime,
      completed: false,
      date: todayStr,
      notes: `Check comprehension and diagnostic mastery`
    });

    if (revisionCandidate) {
      const revShortName = revisionCandidate.title.split(':')[0].trim();
      const revConcept = revisionCandidate.keyConcepts?.[0] || 'Core Mechanics';
      tasks.push({
        id: `task-${todayStr}-revision`,
        topicId: revisionCandidate.id,
        topicTitle: revisionCandidate.title,
        title: `Revision: ${revShortName} (${revConcept})`,
        estimatedMinutes: revisionTime,
        completed: false,
        date: todayStr,
        isRevision: true,
        notes: `Spaced recall refresh for ${revisionCandidate.title}`
      });
    } else {
      // If no past topics yet, do a foundational recap
      tasks.push({
        id: `task-${todayStr}-revision`,
        topicId: activeTopic.id,
        topicTitle: activeTopic.title,
        title: `Revision: ${mainConceptName} Recall & Summary`,
        estimatedMinutes: revisionTime,
        completed: false,
        date: todayStr,
        isRevision: true,
        notes: `Summarize key rules and mental models`
      });
    }
  }

  // 7. Adaptive Recommendation Message
  let recommendation = `Today's plan is tailored for ${dayOfWeek}. Let's focus on "${activeTopic.title}" with a balanced study workflow.`;
  if (wasYesterdayMissed) {
    recommendation = `Welcome back! We kept today's plan smooth and focused at ${Math.round(targetDailyMinutes / 60 * 10) / 10}h without piling on backlog. Steady rhythm wins.`;
  } else if (yesterdayMinutes >= targetDailyMinutes) {
    recommendation = `Great momentum from yesterday! Today we build directly upon what you learned with ${activeTopic.title}.`;
  } else if (weakTopicObjects.length > 0) {
    recommendation = `We scheduled a targeted review on "${weakTopicObjects[0].title}" today to solidify areas where quizzes showed room for improvement.`;
  }

  return {
    date: todayStr,
    dayOfWeek,
    dayGoalMinutes: targetDailyMinutes,
    activeTopic,
    tasks,
    revisionTopic: revisionCandidate,
    weakTopics: Array.from(weakTopicTitles),
    recommendation
  };
}
