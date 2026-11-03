export type StudyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';
export type EducationLevel =
  | 'Intermediate / Class 11–12'
  | 'Diploma'
  | 'B.Tech / Degree'
  | 'Other Undergraduate'
  | 'Competitive Exam Prep';

export interface UserProfile {
  name: string;
  subject: string;
  currentLevel: StudyLevel;
  educationLevel?: EducationLevel;
  course?: string;
  mainGoal: string;
  durationYears: number;
  targetDate: string;
  dailyHours: number;
  studyDays: string[];
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface TopicResource {
  id: string;
  title: string;
  channel: string;
  duration: string;
  type: 'youtube' | 'documentation' | 'interactive';
  url: string;
  searchQuery: string;
  levelBadge: string;
  description: string;
}

export interface PracticeExercise {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  scenario: string;
  starterCode?: string;
  language?: string;
  hints: string[];
  solution: string;
  solutionWalkthrough: string;
  expectedKeywords?: string[];
  validationExplanation?: string;
}

export interface ConceptCheck {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TopicLesson {
  id: string;
  topicId: string;
  topicTitle: string;
  subject: string;
  educationLevel: EducationLevel;
  difficulty: StudyLevel;
  estimatedMinutes: number;
  learningObjectives: string[];
  learningSteps: {
    step: number;
    title: string;
    description: string;
    actionType: 'watch' | 'read' | 'analogy' | 'code' | 'practice' | 'check' | 'quiz' | 'complete';
  }[];
  resources: TopicResource[];
  reading: {
    summary: string;
    sections: {
      heading: string;
      content: string;
      keyTakeaway?: string;
      examTipOrNote?: string;
    }[];
  };
  realWorldAnalogy: {
    title: string;
    analogy: string;
    mapping: {
      realWorldItem: string;
      conceptMapping: string;
    }[];
  };
  codeExamples: {
    title: string;
    language: string;
    code: string;
    explanation: string;
    output?: string;
  }[];
  practiceSection: PracticeExercise[];
  revisionExercise?: PracticeExercise;
  conceptChecks: ConceptCheck[];
  quizQuestions: QuizQuestion[];
}

export interface RoadmapTask {
  id: string;
  topicId: string;
  topicTitle: string;
  title: string;
  category?: 'learn' | 'practice' | 'quiz' | 'revision';
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  date: string; // YYYY-MM-DD
  dayOfWeek?: string;
  isRevision?: boolean;
  notes?: string;
  questionCount?: number;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: StudyLevel;
  keyConcepts: string[];
  prerequisites?: string[];
  status?: 'Not Started' | 'In Progress' | 'Completed';
  type?: 'concept' | 'practice' | 'project' | 'revision' | 'milestone';
  completed: boolean;
  completedAt?: string;
  masteryLevel: number; // 0 - 100
  lastRevisedDate?: string;
  notes: string[];
}

export interface RoadmapWeek {
  id: string;
  weekNumber: number;
  title: string;
  summary: string;
  topics: RoadmapTopic[];
}

export interface RoadmapMonth {
  id: string;
  monthNumber: number;
  title: string;
  summary: string;
  weeks: RoadmapWeek[];
}

export interface RoadmapPeriod {
  id: string;
  periodNumber: number;
  title: string;
  theme: string;
  months: RoadmapMonth[];
}

export interface RoadmapYear {
  id: string;
  yearNumber: number;
  title: string;
  goal: string;
  periods: RoadmapPeriod[];
}

export interface Roadmap {
  id: string;
  overallGoal: string;
  subject: string;
  years: RoadmapYear[];
  aiRecommendation: string;
  lastUpdated: string;
}

export interface StudySession {
  id: string;
  topicId?: string;
  topicTitle: string;
  taskId?: string;
  durationMinutes: number;
  timestamp: string;
  notes: string;
  sessionType: 'focus' | 'quick-study' | 'quiz' | 'revision';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0..3
  explanation: string;
  topic: string;
}

export interface QuizResult {
  id: string;
  date: string;
  topic: string;
  topicTitle?: string;
  topicId?: string;
  score: number;
  total: number;
  difficulty: QuizDifficulty;
  wrongQuestions: {
    question: string;
    chosenOption: string;
    correctOption: string;
    explanation: string;
  }[];
  weakAreas: string[];
  aiFeedback: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  topicContext?: string;
  quickActionType?: string;
}

export interface QuickStudySession {
  durationMinutes: number;
  topicTitle: string;
  coreConcepts: string[];
  highYieldSummary: string;
  rapidCheckQuestions: {
    question: string;
    answer: string;
  }[];
  actionItem: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
}

export type AppTheme = 'clean' | 'modern' | 'calm' | 'gamified' | 'hybrid';

export type TabType =
  | 'home'
  | 'subjects'
  | 'planner'
  | 'focus'
  | 'notes'
  | 'goals'
  | 'progress'
  | 'settings'
  | 'tutor'
  | 'learn'; // Backwards-compatible alias for subjects

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  topicTitle?: string;
  subject?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
}

export interface StudyGoal {
  id: string;
  title: string;
  targetDate: string;
  category: 'exam' | 'skill' | 'project' | 'course' | 'habit';
  progress: number; // 0 to 100
  milestones: { id: string; title: string; completed: boolean }[];
  completed: boolean;
}
