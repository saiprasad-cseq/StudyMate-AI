import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Code2,
  Check,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  Copy,
  Layers,
  Flame,
  Award,
  Video,
  FileText,
  BrainCircuit,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Zap,
  CheckCircle,
  XCircle,
  ThumbsUp,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  TopicLesson,
  RoadmapTopic,
  RoadmapTask,
  UserProfile,
  EducationLevel,
  QuizQuestion,
  PracticeExercise,
} from '../types';
import {
  buildProceduralLesson,
  getEffectiveEducationLevel,
  validatePracticeAnswer,
} from '../lib/lessonEngine';

interface LessonScreenProps {
  topic: RoadmapTopic | { id: string; title: string; description?: string; difficulty?: string; completed?: boolean };
  task?: RoadmapTask | null;
  profile: UserProfile;
  allTopics?: RoadmapTopic[];
  onStartNextLesson?: (nextTopic: RoadmapTopic) => void;
  onCompleteTopic: (topicId: string, timeSpentMinutes: number) => void;
  onCompleteTask?: (taskId: string) => void;
  onBack: () => void;
  onOpenTutorWithTopic?: (topicTitle: string) => void;
  onOpenQuiz?: (topicTitle: string) => void;
}

const EDUCATION_LEVELS: EducationLevel[] = [
  'Intermediate / Class 11–12',
  'Diploma',
  'B.Tech / Degree',
  'Other Undergraduate',
  'Competitive Exam Prep',
];

export const LessonScreen: React.FC<LessonScreenProps> = ({
  topic,
  task,
  profile,
  allTopics,
  onStartNextLesson,
  onCompleteTopic,
  onCompleteTask,
  onBack,
  onOpenTutorWithTopic,
  onOpenQuiz,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>(
    getEffectiveEducationLevel(profile)
  );
  const [lesson, setLesson] = useState<TopicLesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'all' | '1-learn' | '2-videos' | '3-theory' | '4-code' | '5-practice' | '6-check' | '7-quiz' | '8-feedback' | '9-complete' | '10-next'
  >('all');

  // Optional Study Timer state (Secondary, non-blocking)
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceResults, setPracticeResults] = useState<
    Record<
      string,
      {
        submitted: boolean;
        isCorrect: boolean;
        feedback: string;
        nextHint?: string;
        attempts: number;
      }
    >
  >({});
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Revision Exercise state (for poor performance / reinforcement)
  const [revisionAnswer, setRevisionAnswer] = useState('');
  const [revisionResult, setRevisionResult] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    feedback: string;
    nextHint?: string;
    attempts: number;
  }>({
    submitted: false,
    isCorrect: false,
    feedback: '',
    attempts: 0,
  });
  const [revealedRevisionHints, setRevealedRevisionHints] = useState(0);
  const [revealedRevisionSolution, setRevealedRevisionSolution] = useState(false);

  // Concept Check state
  const [conceptAnswers, setConceptAnswers] = useState<Record<string, number>>({});

  // Mini Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Completion state
  const [isCompleted, setIsCompleted] = useState(topic.completed || false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Active Embedded Video URL
  const [activeEmbedQuery, setActiveEmbedQuery] = useState<string | null>(null);

  // Find next topic in roadmap
  const currentTopicIndex =
    allTopics?.findIndex(
      (t) => t.id === topic.id || t.title.toLowerCase() === topic.title.toLowerCase()
    ) ?? -1;

  let nextRoadmapTopic: RoadmapTopic | null = null;
  if (allTopics && allTopics.length > 0) {
    if (currentTopicIndex !== -1 && currentTopicIndex < allTopics.length - 1) {
      // Find the next incomplete topic, or immediate next topic
      nextRoadmapTopic =
        allTopics.slice(currentTopicIndex + 1).find((t) => !t.completed) ||
        allTopics[currentTopicIndex + 1] ||
        null;
    } else if (currentTopicIndex === -1) {
      nextRoadmapTopic = allTopics.find((t) => !t.completed) || allTopics[0] || null;
    }
  }

  // Load lesson data
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const initialLesson = buildProceduralLesson(
      topic.title,
      topic as RoadmapTopic,
      profile,
      selectedLevel
    );
    setLesson(initialLesson);

    // Populate starter code in practice answers
    const initialAnswers: Record<string, string> = {};
    initialLesson.practiceSection.forEach((ex) => {
      initialAnswers[ex.id] = ex.starterCode || '';
    });
    setPracticeAnswers(initialAnswers);

    if (initialLesson.revisionExercise?.starterCode) {
      setRevisionAnswer(initialLesson.revisionExercise.starterCode);
    }

    // Try fetching AI-enriched lesson in background if online
    fetch('/api/ai/topic-lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicTitle: topic.title,
        subject: profile.subject,
        educationLevel: selectedLevel,
        difficulty: topic.difficulty || profile.currentLevel,
        currentGoal: profile.mainGoal,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.success && data?.lesson) {
          setLesson((prev) => {
            if (!prev) return initialLesson;
            return {
              ...prev,
              learningObjectives: data.lesson.learningObjectives || prev.learningObjectives,
              reading: data.lesson.reading || prev.reading,
              realWorldAnalogy: data.lesson.realWorldAnalogy || prev.realWorldAnalogy,
              codeExamples:
                Array.isArray(data.lesson.codeExamples) && data.lesson.codeExamples.length > 0
                  ? data.lesson.codeExamples
                  : prev.codeExamples,
              practiceSection:
                Array.isArray(data.lesson.practiceSection) && data.lesson.practiceSection.length > 0
                  ? data.lesson.practiceSection
                  : prev.practiceSection,
              revisionExercise: data.lesson.revisionExercise || prev.revisionExercise,
              conceptChecks:
                Array.isArray(data.lesson.conceptChecks) && data.lesson.conceptChecks.length > 0
                  ? data.lesson.conceptChecks
                  : prev.conceptChecks,
              quizQuestions:
                Array.isArray(data.lesson.quizQuestions) && data.lesson.quizQuestions.length > 0
                  ? data.lesson.quizQuestions
                  : prev.quizQuestions,
            };
          });
        }
      })
      .catch((err) => {
        console.log('Using procedural lesson engine:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [topic.title, selectedLevel]);

  // Optional background timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Practice Interactive Handler
  const handleAnswerChange = (exerciseId: string, value: string) => {
    setPracticeAnswers((prev) => ({ ...prev, [exerciseId]: value }));
  };

  const handleSubmitPractice = (exercise: PracticeExercise) => {
    const currentAnswer = practiceAnswers[exercise.id] || '';
    const prevAttempts = practiceResults[exercise.id]?.attempts || 0;
    const nextAttempt = prevAttempts + 1;

    const validation = validatePracticeAnswer(exercise, currentAnswer, nextAttempt);

    setPracticeResults((prev) => ({
      ...prev,
      [exercise.id]: {
        submitted: true,
        isCorrect: validation.isCorrect,
        feedback: validation.feedback,
        nextHint: validation.nextHint,
        attempts: nextAttempt,
      },
    }));

    // If correct on submit, trigger mini particle celebration
    if (validation.isCorrect) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
      });
    }
  };

  const handleRevealHint = (exerciseId: string, maxHints: number) => {
    setRevealedHints((prev) => {
      const current = prev[exerciseId] || 0;
      return { ...prev, [exerciseId]: Math.min(maxHints, current + 1) };
    });
  };

  const handleToggleSolution = (exerciseId: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  // Revision Exercise Handlers
  const handleSubmitRevision = () => {
    if (!lesson?.revisionExercise) return;
    const nextAttempt = revisionResult.attempts + 1;
    const validation = validatePracticeAnswer(
      lesson.revisionExercise,
      revisionAnswer,
      nextAttempt
    );

    setRevisionResult({
      submitted: true,
      isCorrect: validation.isCorrect,
      feedback: validation.feedback,
      nextHint: validation.nextHint,
      attempts: nextAttempt,
    });

    if (validation.isCorrect) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  // Concept Check & Quiz Handlers
  const handleConceptSelect = (checkId: string, optionIndex: number) => {
    setConceptAnswers((prev) => ({ ...prev, [checkId]: optionIndex }));
  };

  const handleQuizSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    // Smoothly scroll or navigate to Step 8 Feedback
    setActiveTab('8-feedback');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Performance scoring calculations
  const calculateScores = () => {
    if (!lesson) {
      return {
        practiceCorrect: 0,
        practiceTotal: 0,
        conceptCorrect: 0,
        conceptTotal: 0,
        quizCorrect: 0,
        quizTotal: 0,
        overallPercent: 0,
        isPoor: false,
      };
    }

    const practiceTotal = lesson.practiceSection.length;
    const practiceCorrect = Object.values(practiceResults).filter((r) => r.isCorrect).length;

    const conceptTotal = lesson.conceptChecks.length;
    let conceptCorrect = 0;
    lesson.conceptChecks.forEach((c) => {
      if (conceptAnswers[c.id] === c.correctAnswer) conceptCorrect++;
    });

    const quizTotal = lesson.quizQuestions.length;
    let quizCorrect = 0;
    lesson.quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) quizCorrect++;
    });

    const quizScorePercent = quizTotal > 0 ? (quizCorrect / quizTotal) * 100 : 100;
    const conceptScorePercent = conceptTotal > 0 ? (conceptCorrect / conceptTotal) * 100 : 100;
    const practiceScorePercent = practiceTotal > 0 ? (practiceCorrect / practiceTotal) * 100 : 100;

    let overallPercent = Math.round(
      quizScorePercent * 0.5 + conceptScorePercent * 0.3 + practiceScorePercent * 0.2
    );

    const isPoor = quizSubmitted && (quizScorePercent < 70 || overallPercent < 70);

    return {
      practiceCorrect,
      practiceTotal,
      conceptCorrect,
      conceptTotal,
      quizCorrect,
      quizTotal,
      overallPercent,
      isPoor,
    };
  };

  const scores = calculateScores();

  const handleMarkAsCompleted = () => {
    setIsCompleted(true);
    setShowCelebration(true);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    const finalMinutes = Math.max(
      15,
      Math.round(timerSeconds / 60) || lesson?.estimatedMinutes || 25
    );
    onCompleteTopic(topic.id, finalMinutes);
    if (task && onCompleteTask) {
      onCompleteTask(task.id);
    }
  };

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-stone-600 font-medium">Preparing structured 10-step lesson...</p>
      </div>
    );
  }

  // 10-step definition list
  const stepsList = [
    { id: '1-learn', stepNum: 1, label: '1. Learn Objectives', shortLabel: 'Objectives', icon: Target },
    { id: '2-videos', stepNum: 2, label: '2. YouTube Videos', shortLabel: 'Videos', icon: Video },
    { id: '3-theory', stepNum: 3, label: '3. Explanation', shortLabel: 'Theory', icon: BookOpen },
    { id: '4-code', stepNum: 4, label: '4. Code Examples', shortLabel: 'Code', icon: Code2 },
    { id: '5-practice', stepNum: 5, label: '5. Interactive Practice', shortLabel: 'Practice', icon: BrainCircuit },
    { id: '6-check', stepNum: 6, label: '6. Concept Check', shortLabel: 'Check', icon: HelpCircle },
    { id: '7-quiz', stepNum: 7, label: '7. Topic Quiz', shortLabel: 'Quiz', icon: Award },
    { id: '8-feedback', stepNum: 8, label: '8. Performance Feedback', shortLabel: 'Feedback', icon: TrendingUp },
    { id: '9-complete', stepNum: 9, label: '9. Mark Completed', shortLabel: 'Complete', icon: CheckCircle2 },
    { id: '10-next', stepNum: 10, label: '10. Next Topic', shortLabel: 'Next Topic', icon: ArrowRight },
  ];

  // Dynamic lesson progress calculation across the 10 steps
  const calculateProgress = () => {
    if (isCompleted) return 100;
    let score = 15; // Viewed overview
    if (activeEmbedQuery) score += 10;
    if (scores.practiceCorrect > 0) score += 15;
    if (scores.conceptTotal > 0 && Object.keys(conceptAnswers).length === scores.conceptTotal)
      score += 20;
    if (quizSubmitted) score += 30;
    if (scores.overallPercent >= 70 && quizSubmitted) score += 10;
    return Math.min(100, score);
  };
  const lessonProgressPercent = calculateProgress();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <button
              id="lesson-back-btn"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <span className="text-xs text-stone-400 font-medium">/</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              {profile.subject || 'Core Topic'}
            </span>
            <span className="text-xs text-stone-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              ~{lesson.estimatedMinutes} min
            </span>
            {isCompleted && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {lesson.topicTitle}
          </h1>

          <p className="text-xs sm:text-sm text-stone-600">
            {topic.description ||
              `Structured interactive 10-step learning journey: What I will learn → Videos → Theory → Code → Practice → Checks → Quiz → Feedback → Mark Completed → Next Topic.`}
          </p>
        </div>

        {/* Education Level Switcher & Study Timer Widget */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
          <div className="relative">
            <label className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
              Education Level
            </label>
            <select
              id="education-level-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as EducationLevel)}
              className="text-xs font-medium bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl px-3 py-1.5 pr-7 focus:outline-emerald-600 cursor-pointer"
            >
              {EDUCATION_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-stone-900 text-white px-3 py-1.5 rounded-xl flex items-center gap-2.5 shadow-xs border border-stone-800">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-emerald-400">
                ⏱️ {formatTimer(timerSeconds)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                id="lesson-timer-toggle-btn"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isTimerRunning
                    ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                }`}
                title={isTimerRunning ? 'Pause Study Timer' : 'Start Study Timer (Optional)'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                id="lesson-timer-reset-btn"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="p-1 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC 10-STEP PROGRESS INDICATOR */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-stone-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Interactive 10-Step Journey Progress</span>
          </div>
          <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-xs">
            {lessonProgressPercent}% Completed
          </span>
        </div>

        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${lessonProgressPercent}%` }}
          />
        </div>

        {/* Checkpoint indicators */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-600">
          <span className="inline-flex items-center gap-1 font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
            ✓ 1. Learn & Videos
          </span>
          <span className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md border ${
            scores.practiceCorrect > 0
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-stone-50 text-stone-500 border-stone-200'
          }`}>
            {scores.practiceCorrect > 0 ? '✓' : '○'} 5. Practice ({scores.practiceCorrect}/{scores.practiceTotal})
          </span>
          <span className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md border ${
            scores.conceptTotal > 0 && Object.keys(conceptAnswers).length === scores.conceptTotal
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-stone-50 text-stone-500 border-stone-200'
          }`}>
            {scores.conceptTotal > 0 && Object.keys(conceptAnswers).length === scores.conceptTotal ? '✓' : '○'} 6. Concept Checks
          </span>
          <span className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md border ${
            quizSubmitted
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-stone-50 text-stone-500 border-stone-200'
          }`}>
            {quizSubmitted ? `✓ 7. Quiz (${scores.quizCorrect}/${scores.quizTotal})` : '○ 7. Quiz'}
          </span>
          <span className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md border ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-stone-50 text-stone-500 border-stone-200'
          }`}>
            {isCompleted ? '✓ 9. Completed' : '○ 9. Complete Topic'}
          </span>
        </div>
      </div>

      {/* 3. 10-STEP NAVIGATION TABS BAR */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
          <button
            id="tab-all"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Full Lesson
          </button>

          {stepsList.map((step) => {
            const Icon = step.icon;
            const isActive = activeTab === step.id;
            return (
              <button
                key={step.id}
                id={`tab-${step.id}`}
                onClick={() => setActiveTab(step.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. STEP 1: WHAT I WILL LEARN */}
      {(activeTab === 'all' || activeTab === '1-learn') && (
        <section id="step-1-what-i-will-learn" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                1
              </span>
              <h2 className="text-lg font-bold text-stone-900">What I Will Learn</h2>
            </div>
            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
              Target Outcomes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {lesson.learningObjectives.map((obj, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-emerald-300 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                  {obj}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('2-videos')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              Next: Recommended YouTube Videos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 5. STEP 2: RECOMMENDED YOUTUBE VIDEOS */}
      {(activeTab === 'all' || activeTab === '2-videos') && (
        <section id="step-2-recommended-videos" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center border border-red-200">
                2
              </span>
              <h2 className="text-lg font-bold text-stone-900">Recommended YouTube Videos</h2>
            </div>
            <span className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Video className="w-3.5 h-3.5" /> Curated Top Educators
            </span>
          </div>

          {/* Embedded YouTube search player if requested */}
          {activeEmbedQuery && (
            <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 p-4 space-y-3">
              <div className="flex items-center justify-between text-white text-xs">
                <span className="font-semibold flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-red-400" /> Searching YouTube Lessons for: &ldquo;{activeEmbedQuery}&rdquo;
                </span>
                <button
                  onClick={() => setActiveEmbedQuery(null)}
                  className="text-stone-400 hover:text-white text-xs font-medium px-2 py-1 bg-stone-800 rounded-md cursor-pointer"
                >
                  Close Player
                </button>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-900 border border-stone-800 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <Video className="w-12 h-12 text-red-500 animate-pulse" />
                <p className="text-stone-200 text-sm font-medium max-w-md">
                  Click below to open high-yield video lessons directly in YouTube while keeping your StudyMate lesson open:
                </p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeEmbedQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Watch Top YouTube Videos for &ldquo;{activeEmbedQuery}&rdquo; <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {lesson.resources.map((res, i) => (
              <div
                key={res.id || i}
                className="bg-stone-50 hover:bg-stone-100/80 rounded-xl p-4 border border-stone-200/90 flex flex-col justify-between space-y-3 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                      {res.channel}
                    </span>
                    <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {res.duration}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug line-clamp-2">
                    {res.title}
                  </h3>

                  <p className="text-[11px] text-stone-600 leading-relaxed line-clamp-2">
                    {res.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setActiveEmbedQuery(res.searchQuery || res.title)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 py-2 px-3 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" /> Watch Video
                  </button>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('3-theory')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              Next: Simple Explanation <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 6. STEP 3: SIMPLE EXPLANATION & MENTAL MODEL */}
      {(activeTab === 'all' || activeTab === '3-theory') && (
        <section id="step-3-simple-explanation" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center border border-blue-200">
                3
              </span>
              <h2 className="text-lg font-bold text-stone-900">Simple Explanation & Mental Model</h2>
            </div>
            {onOpenTutorWithTopic && (
              <button
                onClick={() => onOpenTutorWithTopic(lesson.topicTitle)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Ask AI Tutor
              </button>
            )}
          </div>

          {/* Core Summary Card */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              High-Yield Summary
            </h3>
            <p className="text-xs sm:text-sm text-blue-950 font-normal leading-relaxed">
              {lesson.reading.summary}
            </p>
          </div>

          {/* Sub-sections */}
          <div className="space-y-4 pt-1">
            {lesson.reading.sections.map((sec, i) => (
              <div key={i} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                <h3 className="text-sm font-bold text-stone-900">{sec.heading}</h3>
                <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {sec.content}
                </div>
                {sec.keyTakeaway && (
                  <div className="text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Key Takeaway:</strong> {sec.keyTakeaway}</span>
                  </div>
                )}
                {sec.examTipOrNote && (
                  <div className="text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Exam / Interview Tip:</strong> {sec.examTipOrNote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Real-world analogy */}
          {lesson.realWorldAnalogy && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Real-World Mental Model: {lesson.realWorldAnalogy.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                {lesson.realWorldAnalogy.analogy}
              </p>
              {lesson.realWorldAnalogy.mapping && lesson.realWorldAnalogy.mapping.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {lesson.realWorldAnalogy.mapping.map((mapItem, idx) => (
                    <div
                      key={idx}
                      className="bg-white/80 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-950 flex items-center justify-between"
                    >
                      <span className="font-semibold">{mapItem.realWorldItem}</span>
                      <span className="text-amber-700">→</span>
                      <span className="font-mono text-amber-900">{mapItem.conceptMapping}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('4-code')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              Next: Code Examples <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 7. STEP 4: CODE EXAMPLES */}
      {(activeTab === 'all' || activeTab === '4-code') && (
        <section id="step-4-code-examples" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center border border-purple-200">
                4
              </span>
              <h2 className="text-lg font-bold text-stone-900">Code Examples & Step Breakdown</h2>
            </div>
            <span className="text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md">
              Working Syntax
            </span>
          </div>

          <div className="space-y-4">
            {lesson.codeExamples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-stone-200 overflow-hidden bg-stone-950 text-stone-100">
                <div className="bg-stone-900 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-stone-200">{ex.title}</span>
                    <span className="text-[10px] font-mono uppercase bg-stone-800 text-stone-400 px-2 py-0.5 rounded">
                      {ex.language}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(ex.code, `code-${i}`)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-400 hover:text-stone-100 bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    {copiedCodeId === `code-${i}` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 overflow-x-auto font-mono text-xs text-stone-200 leading-relaxed">
                  <pre>{ex.code}</pre>
                </div>

                {ex.explanation && (
                  <div className="bg-stone-900/90 border-t border-stone-800 p-3.5 text-xs text-stone-300 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-200">How it works: </strong>
                      {ex.explanation}
                    </div>
                  </div>
                )}

                {ex.output && (
                  <div className="bg-stone-900/50 border-t border-stone-800/80 px-4 py-2 text-[11px] text-emerald-400 font-mono flex items-center gap-2">
                    <span className="text-stone-500">Output:</span>
                    <span className="whitespace-pre-wrap">{ex.output}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('5-practice')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              Next: Interactive Practice <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 8. STEP 5: INTERACTIVE PRACTICE */}
      {(activeTab === 'all' || activeTab === '5-practice') && (
        <section id="step-5-interactive-practice" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                5
              </span>
              <h2 className="text-lg font-bold text-stone-900">Interactive Practice & Instant Check</h2>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              Hands-On Exercises
            </span>
          </div>

          <div className="space-y-6">
            {lesson.practiceSection.map((ex, i) => {
              const res = practiceResults[ex.id];
              const curAnswer = practiceAnswers[ex.id] || '';
              const hintsGiven = revealedHints[ex.id] || 0;
              const solRevealed = revealedSolutions[ex.id] || false;

              return (
                <div
                  key={ex.id || i}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-emerald-600" />
                      {ex.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border self-start ${
                        ex.difficulty === 'Easy'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : ex.difficulty === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {ex.difficulty}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {ex.scenario}
                  </p>

                  {/* Interactive Code / Answer Area */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      Write your solution or fix below:
                    </label>
                    <textarea
                      id={`practice-input-${ex.id}`}
                      value={curAnswer}
                      onChange={(e) => handleAnswerChange(ex.id, e.target.value)}
                      rows={5}
                      className="w-full font-mono text-xs p-3.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-emerald-600 shadow-inner"
                      placeholder="// Type your code / answer formula here..."
                    />
                  </div>

                  {/* Controls: Submit Answer, Hint, Reveal Solution */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        id={`practice-submit-${ex.id}`}
                        onClick={() => handleSubmitPractice(ex)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Submit Answer & Check
                      </button>

                      <button
                        onClick={() => handleRevealHint(ex.id, ex.hints.length)}
                        disabled={hintsGiven >= ex.hints.length}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        {hintsGiven === 0
                          ? 'Need a Hint?'
                          : `Hint (${hintsGiven}/${ex.hints.length})`}
                      </button>
                    </div>

                    <button
                      onClick={() => handleToggleSolution(ex.id)}
                      className="text-xs font-medium text-stone-600 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
                    >
                      {solRevealed ? 'Hide Solution' : 'View Model Solution'}
                    </button>
                  </div>

                  {/* Feedback Box (Immediate Correct / Incorrect with progressive hint) */}
                  {res?.submitted && (
                    <div
                      className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                        res.isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-amber-50 border-amber-300 text-amber-950'
                      }`}
                    >
                      {res.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1.5 flex-1 text-xs sm:text-sm">
                        <div className="font-bold">
                          {res.isCorrect
                            ? '🎉 Correct! Great job!'
                            : 'Not quite there yet — here is a hint to help you:'}
                        </div>
                        <div className="leading-relaxed">{res.feedback}</div>
                        {!res.isCorrect && res.nextHint && (
                          <div className="p-2.5 rounded-lg bg-amber-100/70 border border-amber-200 text-xs font-medium text-amber-900 mt-2">
                            💡 <strong>Hint:</strong> {res.nextHint}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Revealed Hints */}
                  {hintsGiven > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {ex.hints.slice(0, hintsGiven).map((hint, hIdx) => (
                        <div
                          key={hIdx}
                          className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Hint {hIdx + 1}:</strong> {hint}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Revealed Solution */}
                  {solRevealed && (
                    <div className="rounded-xl border border-stone-300 bg-stone-900 text-stone-100 p-4 space-y-2.5">
                      <div className="text-xs font-bold text-stone-300 flex items-center justify-between">
                        <span>Model Solution Walkthrough</span>
                        <button
                          onClick={() => handleCopyCode(ex.solution, `sol-${ex.id}`)}
                          className="text-[10px] bg-stone-800 hover:bg-stone-700 px-2 py-0.5 rounded cursor-pointer"
                        >
                          {copiedCodeId === `sol-${ex.id}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="font-mono text-xs text-emerald-400 overflow-x-auto p-2 bg-stone-950 rounded">
                        {ex.solution}
                      </pre>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {ex.solutionWalkthrough}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('6-check')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              Next: Quick Concept Check <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 9. STEP 6: QUICK CONCEPT CHECK */}
      {(activeTab === 'all' || activeTab === '6-check') && (
        <section id="step-6-concept-check" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center border border-indigo-200">
                6
              </span>
              <h2 className="text-lg font-bold text-stone-900">Quick Concept Check</h2>
            </div>
            <span className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
              Instant Recall Verification
            </span>
          </div>

          <div className="space-y-4">
            {lesson.conceptChecks.map((cc, qIdx) => {
              const selectedOpt = conceptAnswers[cc.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === cc.correctAnswer;

              return (
                <div
                  key={cc.id || qIdx}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
                >
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                    {qIdx + 1}. {cc.question}
                  </h3>

                  <div className="space-y-2">
                    {cc.options.map((opt, oIdx) => {
                      let btnStyle = 'bg-white hover:bg-stone-100 border-stone-200 text-stone-800';
                      if (isAnswered) {
                        if (oIdx === cc.correctAnswer) {
                          btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-semibold';
                        } else if (selectedOpt === oIdx) {
                          btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                        } else {
                          btnStyle = 'bg-white opacity-60 border-stone-200 text-stone-500';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          id={`cc-${cc.id}-opt-${oIdx}`}
                          onClick={() => handleConceptSelect(cc.id, oIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && oIdx === cc.correctAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && selectedOpt === oIdx && oIdx !== cc.correctAnswer && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div
                      className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-950'
                      }`}
                    >
                      <strong>{isCorrect ? '✓ Correct! ' : 'Explanation: '}</strong>
                      {cc.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('7-quiz')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              Next: Topic Quiz <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 10. STEP 7: TOPIC QUIZ */}
      {(activeTab === 'all' || activeTab === '7-quiz') && (
        <section id="step-7-topic-quiz" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-200">
                7
              </span>
              <h2 className="text-lg font-bold text-stone-900">Topic Quiz</h2>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
              Diagnostic Mastery Test
            </span>
          </div>

          <div className="space-y-4">
            {lesson.quizQuestions.map((q, qIdx) => {
              const selectedOpt = quizAnswers[q.id];
              const isSelected = selectedOpt !== undefined;

              return (
                <div
                  key={q.id || qIdx}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
                >
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                    Question {qIdx + 1}: {q.question}
                  </h3>

                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      let btnStyle = 'bg-white hover:bg-stone-100 border-stone-200 text-stone-800';
                      if (quizSubmitted) {
                        if (oIdx === q.correctAnswer) {
                          btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-semibold';
                        } else if (selectedOpt === oIdx) {
                          btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                        } else {
                          btnStyle = 'bg-white opacity-60 border-stone-200 text-stone-500';
                        }
                      } else if (selectedOpt === oIdx) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                      }

                      return (
                        <button
                          key={oIdx}
                          id={`quiz-${q.id}-opt-${oIdx}`}
                          onClick={() => handleQuizSelect(q.id, oIdx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && oIdx === q.correctAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {quizSubmitted && selectedOpt === oIdx && oIdx !== q.correctAnswer && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-800 leading-relaxed">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-stone-500">
                Answer all questions and submit to generate your performance score.
              </span>
              <button
                id="submit-topic-quiz-btn"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length === 0}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4" /> Submit Topic Quiz & View Feedback
              </button>
            </div>
          ) : (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('8-feedback')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
              >
                View Performance Scorecard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* 11. STEP 8: FEEDBACK & MASTERY EVALUATION (Adaptive revision vs progression) */}
      {(activeTab === 'all' || activeTab === '8-feedback') && (
        <section id="step-8-feedback" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center border border-rose-200">
                8
              </span>
              <h2 className="text-lg font-bold text-stone-900">Feedback & Performance Evaluation</h2>
            </div>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md">
              Scorecard Analysis
            </span>
          </div>

          {/* Performance Score Overview Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-1">
              <div className="text-[11px] font-bold text-stone-500 uppercase">Quiz Accuracy</div>
              <div className="text-2xl font-bold text-stone-900 font-mono">
                {quizSubmitted ? `${Math.round((scores.quizCorrect / scores.quizTotal) * 100)}%` : 'Pending'}
              </div>
              <div className="text-[11px] text-stone-500">
                {scores.quizCorrect} of {scores.quizTotal} correct
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-1">
              <div className="text-[11px] font-bold text-stone-500 uppercase">Concept Checks</div>
              <div className="text-2xl font-bold text-stone-900 font-mono">
                {scores.conceptTotal > 0
                  ? `${Math.round((scores.conceptCorrect / scores.conceptTotal) * 100)}%`
                  : '100%'}
              </div>
              <div className="text-[11px] text-stone-500">
                {scores.conceptCorrect} of {scores.conceptTotal} verified
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-1">
              <div className="text-[11px] font-bold text-stone-500 uppercase">Practice Problems</div>
              <div className="text-2xl font-bold text-stone-900 font-mono">
                {scores.practiceTotal > 0
                  ? `${Math.round((scores.practiceCorrect / scores.practiceTotal) * 100)}%`
                  : '100%'}
              </div>
              <div className="text-[11px] text-stone-500">
                {scores.practiceCorrect} of {scores.practiceTotal} solved
              </div>
            </div>
          </div>

          {/* Adaptive Feedback: High Mastery vs Revision Required */}
          {scores.isPoor ? (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-amber-900">
                    ⚠️ Concept Revision Recommended for &ldquo;{lesson.topicTitle}&rdquo;
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                    Your score was below 70%. We noticed some foundational gaps in this topic. We strongly recommend reinforcing your intuition with the extra revision exercise below before marking the topic completed.
                  </p>
                </div>
              </div>

              {/* Extra Practice / Revision Question */}
              {lesson.revisionExercise && (
                <div className="p-4 rounded-xl bg-white border border-amber-300/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      {lesson.revisionExercise.title}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Reinforcement Question
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {lesson.revisionExercise.scenario}
                  </p>

                  <textarea
                    id="revision-practice-input"
                    value={revisionAnswer}
                    onChange={(e) => setRevisionAnswer(e.target.value)}
                    rows={4}
                    className="w-full font-mono text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:outline-amber-600"
                    placeholder="// Write your revision answer here..."
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        id="submit-revision-answer-btn"
                        onClick={handleSubmitRevision}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Check Revision Answer
                      </button>

                      <button
                        onClick={() =>
                          setRevealedRevisionHints((prev) =>
                            Math.min(lesson.revisionExercise?.hints?.length || 1, prev + 1)
                          )
                        }
                        className="text-xs text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-xl font-medium cursor-pointer"
                      >
                        Need a Hint? ({revealedRevisionHints}/{lesson.revisionExercise.hints.length})
                      </button>
                    </div>

                    <button
                      onClick={() => setRevealedRevisionSolution(!revealedRevisionSolution)}
                      className="text-xs font-medium text-stone-600 underline cursor-pointer"
                    >
                      {revealedRevisionSolution ? 'Hide Solution' : 'View Model Solution'}
                    </button>
                  </div>

                  {/* Revision Result Feedback */}
                  {revisionResult.submitted && (
                    <div
                      className={`p-3 rounded-xl border text-xs ${
                        revisionResult.isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                          : 'bg-amber-100 border-amber-300 text-amber-950'
                      }`}
                    >
                      {revisionResult.isCorrect ? '✓ ' : '💡 '}
                      {revisionResult.feedback}
                      {!revisionResult.isCorrect && revisionResult.nextHint && (
                        <div className="mt-1 font-medium">Hint: {revisionResult.nextHint}</div>
                      )}
                    </div>
                  )}

                  {revealedRevisionHints > 0 && (
                    <div className="space-y-1">
                      {lesson.revisionExercise.hints.slice(0, revealedRevisionHints).map((h, idx) => (
                        <div key={idx} className="p-2 rounded bg-amber-50 text-xs text-amber-900">
                          💡 <strong>Hint {idx + 1}:</strong> {h}
                        </div>
                      ))}
                    </div>
                  )}

                  {revealedRevisionSolution && (
                    <div className="p-3 bg-stone-900 text-stone-100 rounded-xl space-y-1 font-mono text-xs">
                      <div className="text-stone-400 font-sans font-bold">Model Solution:</div>
                      <pre className="text-emerald-400">{lesson.revisionExercise.solution}</pre>
                      <div className="text-stone-300 font-sans text-[11px] pt-1">
                        {lesson.revisionExercise.solutionWalkthrough}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setActiveTab('3-theory')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Re-read Simple Explanation (Step 3)
                </button>
                {onOpenTutorWithTopic && (
                  <button
                    onClick={() => onOpenTutorWithTopic(lesson.topicTitle)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Ask AI Tutor for a Simpler Explanation
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>🎯 Outstanding Command! You have mastered {lesson.topicTitle}.</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                You demonstrated high accuracy across practice problems, concept checks, and diagnostic quizzes. You are ready to lock in your progress and advance to the next topic in your curriculum!
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('9-complete')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              Next: Mark Completed <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 12. STEP 9: MARK COMPLETED */}
      {(activeTab === 'all' || activeTab === '9-complete') && (
        <section id="step-9-mark-completed" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-200">
                9
              </span>
              <h2 className="text-lg font-bold text-stone-900">Mark Completed & Save Progress</h2>
            </div>
            <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
              Progress Tracking
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-stone-900">
                {isCompleted ? '✓ Topic Milestone Achieved' : 'Ready to record your completion?'}
              </h3>
              <p className="text-xs text-stone-600 max-w-md leading-relaxed">
                {isCompleted
                  ? `You have marked "${lesson.topicTitle}" as completed. Your study time and roadmap streak have been updated!`
                  : `Clicking below will record your study session, log your focus time, advance your daily streak, and unlock the next milestone.`}
              </p>
            </div>

            <button
              id="mark-lesson-complete-btn"
              onClick={handleMarkAsCompleted}
              disabled={isCompleted}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? 'Topic Completed ✓' : 'Mark Completed'}
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('10-next')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              Next: Recommended Next Topic <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 13. STEP 10: RECOMMEND THE NEXT TOPIC */}
      {(activeTab === 'all' || activeTab === '10-next') && (
        <section id="step-10-recommend-next-topic" className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center border border-purple-200">
                10
              </span>
              <h2 className="text-lg font-bold text-stone-900">Recommend the Next Topic</h2>
            </div>
            <span className="text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md">
              Continuous Learning Path
            </span>
          </div>

          {nextRoadmapTopic ? (
            <div className="p-5 rounded-2xl bg-linear-to-br from-emerald-50/80 to-teal-50/60 border border-emerald-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                    Next Structured Milestone
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    {nextRoadmapTopic.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-medium text-stone-600 bg-white/80 border border-stone-200 px-2.5 py-1 rounded-lg">
                    ~{nextRoadmapTopic.estimatedHours || 2} hrs
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                      nextRoadmapTopic.difficulty === 'Beginner'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : nextRoadmapTopic.difficulty === 'Intermediate'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-rose-100 text-rose-800 border-rose-200'
                    }`}
                  >
                    {nextRoadmapTopic.difficulty || 'Core'}
                  </span>
                </div>
              </div>

              {nextRoadmapTopic.keyConcepts && nextRoadmapTopic.keyConcepts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">
                    Key Concepts to Explore:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {nextRoadmapTopic.keyConcepts.map((kc, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white text-stone-800 font-medium px-2.5 py-1 rounded-lg border border-stone-200"
                      >
                        {kc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <p className="text-xs text-stone-600">
                  Ready to continue? Launch the full 10-step interactive lesson for {nextRoadmapTopic.title}.
                </p>

                <button
                  id="start-next-lesson-btn"
                  onClick={() => {
                    if (onStartNextLesson && nextRoadmapTopic) {
                      onStartNextLesson(nextRoadmapTopic);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Start Next Lesson: {nextRoadmapTopic.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-3">
              <GraduationCap className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-stone-900">
                🎉 Congratulations! You have reached the end of your roadmap.
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                You have completed all planned topics in your study curriculum. You can review earlier lessons, practice diagnostic quizzes, or chat with your AI Tutor for advanced interview preparation.
              </p>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 bg-stone-200 hover:bg-stone-300 px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Roadmap Dashboard
              </button>
            </div>
          )}
        </section>
      )}

      {/* 14. BOTTOM SUMMARY / RETURN BAR */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>

        {onOpenTutorWithTopic && (
          <button
            onClick={() => onOpenTutorWithTopic(lesson.topicTitle)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Ask AI Tutor About {lesson.topicTitle}
          </button>
        )}
      </div>
    </div>
  );
};
