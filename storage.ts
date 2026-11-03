import { UserProfile, Roadmap, RoadmapTask, StudySession, QuizResult, ChatMessage, RoadmapTopic, AppTheme, StudyNote, StudyGoal } from '../types';
import { generateDailyPlan } from './dailyPlanningEngine';
import { buildProceduralCurriculum } from './curriculumEngine';

const STORAGE_KEYS = {
  PROFILE: 'studymate_profile',
  ROADMAP: 'studymate_roadmap',
  TASKS: 'studymate_tasks',
  SESSIONS: 'studymate_sessions',
  QUIZZES: 'studymate_quizzes',
  CHAT_MESSAGES: 'studymate_chat_messages',
  STREAK_INFO: 'studymate_streak_info',
  ACTIVE_TAB: 'studymate_active_tab',
  THEME: 'studymate_theme',
  NOTES: 'studymate_notes',
  GOALS: 'studymate_goals',
};

export const defaultProfile: UserProfile = {
  name: 'Sai',
  subject: 'Computer Science & Engineering',
  currentLevel: 'Beginner',
  mainGoal: 'Master Data Structures, Algorithms & Full-Stack Systems',
  durationYears: 3,
  targetDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dailyHours: 1.5,
  studyDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  createdAt: new Date().toISOString(),
  onboardingCompleted: false,
};

export function hasGenericPlaceholders(roadmap: Roadmap | null): boolean {
  if (!roadmap || !roadmap.years || roadmap.years.length === 0) return true;
  const raw = JSON.stringify(roadmap);
  return (
    raw.includes('Core Focus') ||
    raw.includes('Essential Tools') ||
    raw.includes('Core Computer Science') ||
    raw.includes('Algorithmic Patterns') ||
    raw.includes('Essential Data Structures') ||
    raw.includes('Part 1') ||
    raw.includes('Part 2')
  );
}

export function migrateRoadmap(profile: UserProfile, oldRoadmap: Roadmap | null): Roadmap {
  const duration = Math.max(1, Math.min(4, Math.round(profile.durationYears || 3)));
  const dailyHours = Number(profile.dailyHours) || 1.5;
  const studyDaysCount = Array.isArray(profile.studyDays) ? profile.studyDays.length : 5;

  const upgraded = buildProceduralCurriculum(
    profile.subject || 'Computer Science & Engineering',
    profile.currentLevel || 'Beginner',
    profile.mainGoal || 'Mastery',
    duration,
    dailyHours,
    studyDaysCount
  );

  // Preserve any topic completion or notes if old topic IDs or titles match
  if (oldRoadmap?.years) {
    const completedSet = new Set<string>();
    oldRoadmap.years.forEach((y) =>
      y.periods?.forEach((p) =>
        p.months?.forEach((m) =>
          m.weeks?.forEach((w) =>
            w.topics?.forEach((t) => {
              if (t.completed) {
                completedSet.add(t.id);
                completedSet.add(t.title.toLowerCase().trim());
              }
            })
          )
        )
      )
    );

    upgraded.years.forEach((y) =>
      y.periods?.forEach((p) =>
        p.months?.forEach((m) =>
          m.weeks?.forEach((w) =>
            w.topics?.forEach((t) => {
              if (completedSet.has(t.id) || completedSet.has(t.title.toLowerCase().trim())) {
                t.completed = true;
                t.masteryLevel = 100;
              }
            })
          )
        )
      )
    );
  }

  saveStoredRoadmap(upgraded);
  return upgraded;
}

export function getStoredProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading profile from storage', e);
    return null;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile', e);
  }
}

export function getStoredRoadmap(): Roadmap | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Roadmap;
    return parsed;
  } catch (e) {
    console.error('Error reading roadmap from storage', e);
    return null;
  }
}

export function saveStoredRoadmap(roadmap: Roadmap): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
  } catch (e) {
    console.error('Error saving roadmap', e);
  }
}

export function getStoredTasks(): RoadmapTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveStoredTasks(tasks: RoadmapTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks', e);
  }
}

export function getStoredSessions(): StudySession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveStoredSessions(sessions: StudySession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving sessions', e);
  }
}

export function getStoredQuizzes(): QuizResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveStoredQuizzes(quizzes: QuizResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  } catch (e) {
    console.error('Error saving quizzes', e);
  }
}

export function getStoredChatMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveStoredChatMessages(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving chat messages', e);
  }
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string; // YYYY-MM-DD
}

export function getStreakData(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK_INFO);
    if (!raw) {
      return { currentStreak: 1, longestStreak: 1, lastStudyDate: '' };
    }
    return JSON.parse(raw);
  } catch (e) {
    return { currentStreak: 1, longestStreak: 1, lastStudyDate: '' };
  }
}

export function updateStreakOnStudy(): StreakData {
  const today = new Date().toISOString().split('T')[0];
  const current = getStreakData();

  if (current.lastStudyDate === today) {
    return current;
  }

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  let newStreak = 1;
  if (current.lastStudyDate === yesterday) {
    newStreak = current.currentStreak + 1;
  } else if (!current.lastStudyDate) {
    newStreak = 1;
  }

  const updated: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, current.longestStreak || 1),
    lastStudyDate: today,
  };

  try {
    localStorage.setItem(STORAGE_KEYS.STREAK_INFO, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  return updated;
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function getStoredTheme(): AppTheme {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME) as AppTheme | null;
    if (raw && ['clean', 'modern', 'calm', 'gamified', 'hybrid'].includes(raw)) {
      return raw;
    }
    return 'clean';
  } catch (e) {
    return 'clean';
  }
}

export function saveStoredTheme(theme: AppTheme): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Error saving theme to storage', e);
  }
}

export function getStoredNotes(): StudyNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!raw) {
      return [
        {
          id: 'note-sample-1',
          title: 'Core Concepts & Study Heuristics',
          content: 'Key reminder: Focus on first-principles understanding before memorization. When learning algorithms or system architectures, visualize the data flow step-by-step.',
          tags: ['Study Strategy', 'Core Principles'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pinned: true,
        },
      ];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveStoredNotes(notes: StudyNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error('Error saving notes to storage', e);
  }
}

export function getStoredGoals(profile?: UserProfile | null): StudyGoal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) {
      const targetDate = profile?.targetDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return [
        {
          id: 'goal-primary',
          title: profile?.mainGoal || 'Master Target Subject Curriculum',
          targetDate,
          category: 'course',
          progress: 25,
          completed: false,
          milestones: [
            { id: 'm-1', title: 'Complete Foundations & Core Concepts', completed: true },
            { id: 'm-2', title: 'Achieve 80%+ on Periodic Review Quizzes', completed: false },
            { id: 'm-3', title: 'Build Practical Milestone Project', completed: false },
            { id: 'm-4', title: 'Full Curriculum Mastery & Revision', completed: false },
          ],
        },
      ];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveStoredGoals(goals: StudyGoal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Error saving goals to storage', e);
  }
}

// Helper to generate dynamic daily tasks from active roadmap topic and progress
export function generateInitialTasks(
  roadmap: Roadmap,
  profile: UserProfile,
  sessions: StudySession[] = [],
  quizzes: QuizResult[] = [],
  availableMinutes?: number
): RoadmapTask[] {
  const plan = generateDailyPlan({
    profile,
    roadmap,
    tasks: [],
    sessions,
    quizzes,
    availableMinutes,
  });

  return plan.tasks;
}

