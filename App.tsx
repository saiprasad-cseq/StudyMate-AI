import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  UserProfile,
  Roadmap,
  RoadmapTask,
  RoadmapTopic,
  StudySession,
  QuizResult,
  ChatMessage,
  AppTheme,
  StudyNote,
  StudyGoal,
} from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredRoadmap,
  saveStoredRoadmap,
  getStoredTasks,
  saveStoredTasks,
  getStoredSessions,
  saveStoredSessions,
  getStoredQuizzes,
  saveStoredQuizzes,
  getStoredChatMessages,
  saveStoredChatMessages,
  getStreakData,
  updateStreakOnStudy,
  clearAllData,
  generateInitialTasks,
  hasGenericPlaceholders,
  migrateRoadmap,
  StreakData,
  getStoredTheme,
  saveStoredTheme,
  getStoredNotes,
  saveStoredNotes,
  getStoredGoals,
  saveStoredGoals,
} from './lib/storage';
import { buildProceduralCurriculum } from './lib/curriculumEngine';
import { THEMES } from './lib/theme';

import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Sidebar, BottomNav, TabType } from './components/Navigation';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeScreen } from './components/HomeScreen';
import { LearnScreen } from './components/LearnScreen';
import { TutorScreen } from './components/TutorScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { PlannerScreen } from './components/PlannerScreen';
import { FocusScreen } from './components/FocusScreen';
import { NotesScreen } from './components/NotesScreen';
import { GoalsScreen } from './components/GoalsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { FocusTimerModal } from './components/FocusTimerModal';
import { QuickStudyModal } from './components/QuickStudyModal';
import { QuizModal } from './components/QuizModal';
import { SettingsModal } from './components/SettingsModal';
import { LessonScreen } from './components/LessonScreen';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => getStoredProfile());
  const [roadmap, setRoadmap] = useState<Roadmap | null>(() => getStoredRoadmap());
  const [tasks, setTasks] = useState<RoadmapTask[]>(() => getStoredTasks());
  const [sessions, setSessions] = useState<StudySession[]>(() => getStoredSessions());
  const [quizzes, setQuizzes] = useState<QuizResult[]>(() => getStoredQuizzes());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => getStoredChatMessages());
  const [streakData, setStreakData] = useState(() => getStreakData());
  const [theme, setTheme] = useState<AppTheme>(() => getStoredTheme());
  const [notes, setNotes] = useState<StudyNote[]>(() => getStoredNotes());
  const [goals, setGoals] = useState<StudyGoal[]>(() => getStoredGoals(getStoredProfile()));

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeTopicForTutor, setActiveTopicForTutor] = useState<RoadmapTopic | null>(null);

  // Synchronize active theme attribute with document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSelectTheme = (newTheme: AppTheme) => {
    console.log(`[StudyMate Theme] Switching visual theme to: "${newTheme}"`);
    setTheme(newTheme);
    saveStoredTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSaveNotes = (updatedNotes: StudyNote[]) => {
    setNotes(updatedNotes);
    saveStoredNotes(updatedNotes);
  };

  const handleSaveGoals = (updatedGoals: StudyGoal[]) => {
    setGoals(updatedGoals);
    saveStoredGoals(updatedGoals);
  };

  // Active Lesson Screen State
  const [activeLessonTopic, setActiveLessonTopic] = useState<{
    id: string;
    title: string;
    description?: string;
    difficulty?: string;
  } | null>(null);
  const [activeLessonTask, setActiveLessonTask] = useState<RoadmapTask | null>(null);

  // Modals state
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerInitialTopic, setTimerInitialTopic] = useState<RoadmapTopic | null>(null);
  const [timerInitialTask, setTimerInitialTask] = useState<RoadmapTask | null>(null);

  const [showQuickStudyModal, setShowQuickStudyModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizInitialTopic, setQuizInitialTopic] = useState<RoadmapTopic | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleSelectTab = (tab: TabType) => {
    if (activeLessonTopic) {
      setActiveLessonTopic(null);
      setActiveLessonTask(null);
    }
    setShowSettingsModal(false);
    setShowTimerModal(false);
    setShowQuickStudyModal(false);
    setShowQuizModal(false);
    console.log(`[StudyMate Navigation] Switching tab to: "${tab}" (previous: "${activeTab}")`);
    setActiveTab(tab);
  };

  // Monitor activeTab transitions across app lifecycle
  useEffect(() => {
    console.log(`[StudyMate State Monitor] activeTab is now: "${activeTab}" | activeTopicForTutor: "${activeTopicForTutor?.title || 'None'}"`);
  }, [activeTab, activeTopicForTutor]);

  // Sync state changes with localStorage
  useEffect(() => {
    if (profile) saveStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    if (roadmap && profile) saveStoredRoadmap(roadmap);
  }, [roadmap, profile]);

  useEffect(() => {
    if (profile) saveStoredTasks(tasks);
  }, [tasks, profile]);

  useEffect(() => {
    if (profile) saveStoredSessions(sessions);
  }, [sessions, profile]);

  useEffect(() => {
    if (profile) saveStoredQuizzes(quizzes);
  }, [quizzes, profile]);

  useEffect(() => {
    if (profile) saveStoredChatMessages(chatMessages);
  }, [chatMessages, profile]);

  // Automatically upgrade roadmap if it contains legacy generic placeholders
  useEffect(() => {
    if (profile) {
      if (hasGenericPlaceholders(roadmap)) {
        const upgradedRoadmap = migrateRoadmap(profile, roadmap);
        setRoadmap(upgradedRoadmap);
        const updatedTasks = generateInitialTasks(upgradedRoadmap, profile, sessions, quizzes);
        setTasks(updatedTasks);
        saveStoredRoadmap(upgradedRoadmap);
        saveStoredTasks(updatedTasks);
      }
    }
  }, [profile]);

  // Flatten all topics from roadmap
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

  const completedTopicsCount = allTopics.filter((t) => t.completed).length;
  const completionPercent = allTopics.length > 0
    ? Math.round((completedTopicsCount / allTopics.length) * 100)
    : 0;

  // Calculate today's completed minutes from sessions
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCompletedMinutes = sessions
    .filter((s) => s.timestamp.startsWith(todayStr))
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  // Onboarding completion handler
  const handleOnboardingComplete = (newProfile: UserProfile, newRoadmap: Roadmap) => {
    setProfile(newProfile);
    setRoadmap(newRoadmap);
    const initialTasks = generateInitialTasks(newRoadmap, newProfile, sessions, quizzes);
    setTasks(initialTasks);
    saveStoredProfile(newProfile);
    saveStoredRoadmap(newRoadmap);
    saveStoredTasks(initialTasks);
  };

  // Task operations
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nowCompleted = !t.completed;
          if (nowCompleted) {
            const updatedStreak = updateStreakOnStudy();
            setStreakData(updatedStreak);
          }
          return {
            ...t,
            completed: nowCompleted,
            completedAt: nowCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: RoadmapTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleEditTask = (updatedTask: RoadmapTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Focus Timer operations
  const handleStartTimer = (task?: RoadmapTask, topic?: RoadmapTopic) => {
    setTimerInitialTask(task || null);
    setTimerInitialTopic(topic || null);
    setShowTimerModal(true);
  };

  const handleSessionComplete = (newSession: StudySession) => {
    setSessions((prev) => [newSession, ...prev]);
    const updatedStreak = updateStreakOnStudy();
    setStreakData(updatedStreak);

    // If task was attached, mark task complete
    if (newSession.taskId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === newSession.taskId ? { ...t, completed: true } : t))
      );
    }

    // If topic was attached and note was provided, save note to topic
    if (newSession.topicId && newSession.notes && roadmap) {
      const updatedRoadmap: Roadmap = {
        ...roadmap,
        years: roadmap.years.map((y) => ({
          ...y,
          periods: y.periods.map((p) => ({
            ...p,
            months: p.months.map((m) => ({
              ...m,
              weeks: m.weeks.map((w) => ({
                ...w,
                topics: w.topics.map((t) => {
                  if (t.id === newSession.topicId) {
                    return {
                      ...t,
                      notes: [newSession.notes, ...(t.notes || [])],
                    };
                  }
                  return t;
                }),
              })),
            })),
          })),
        })),
        lastUpdated: new Date().toISOString(),
      };
      setRoadmap(updatedRoadmap);
    }

    setShowTimerModal(false);
  };

  // AI Tutor operations (optimized with fast payload and connection resilience)
  const handleSendMessageToTutor = async (content: string, quickAction?: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      topicContext: activeTopicForTutor?.title,
      quickActionType: quickAction,
    };

    const newHistory = [...chatMessages, userMsg];
    const assistantMsgId = `msg-${Date.now()}-assistant`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      topicContext: activeTopicForTutor?.title,
    };

    setChatMessages([...newHistory, initialAssistantMsg]);

    const completedTopicTitles = allTopics.filter((t) => t.completed).map((t) => t.title);
    const weakTopicTitles = Array.from(
      new Set(quizzes.filter((q) => q.score < 70).map((q) => q.topicTitle || q.topic))
    );

    // Keep payload lightweight for fast transmission on mobile networks
    const trimmedHistory = newHistory.slice(-6);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      const response = await fetch('/api/ai/tutor-chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: trimmedHistory,
          userProfile: profile,
          activeTopic: activeTopicForTutor,
          quickAction,
          dailyTasks: tasks.slice(0, 4),
          completedTopics: completedTopicTitles.slice(-5),
          weakTopics: weakTopicTitles.slice(0, 3),
          longTermGoal: profile?.mainGoal,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Streaming response status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.replace(/^data:\s*/, '');
          if (!jsonStr) continue;

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.text) {
              accumulatedText += parsed.text;
              setChatMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId ? { ...msg, content: accumulatedText } : msg
                )
              );
            }
          } catch (parseErr) {
            // Safe parse ignore
          }
        }
      }

      clearTimeout(timeoutId);

      // Handle any trailing buffer chunk
      if (buffer.trim().startsWith('data:')) {
        try {
          const jsonStr = buffer.trim().replace(/^data:\s*/, '');
          const parsed = JSON.parse(jsonStr);
          if (parsed.text) {
            accumulatedText += parsed.text;
            setChatMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId ? { ...msg, content: accumulatedText } : msg
              )
            );
          }
        } catch (e) {
          // Ignore
        }
      }

      if (!accumulatedText.trim()) {
        console.log(`[AI Tutor Stream] No stream chunks received; querying standard fallback endpoint. activeTab="${activeTab}"`);
        const fallbackRes = await fetch('/api/ai/tutor-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: trimmedHistory,
            userProfile: profile,
            activeTopic: activeTopicForTutor,
            quickAction,
            dailyTasks: tasks.slice(0, 4),
            completedTopics: completedTopicTitles.slice(-5),
            weakTopics: weakTopicTitles.slice(0, 3),
            longTermGoal: profile?.mainGoal,
          }),
        });
        const fallbackData = await fallbackRes.json();
        const finalReply = fallbackData.reply || `Here is a clear breakdown for **${activeTopicForTutor?.title || profile?.subject || 'this concept'}**: Focus on the foundational principles and practice simple variations step-by-step.`;
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: finalReply } : msg
          )
        );
        console.log(`[AI Tutor] Fallback response completed. Post-fallback activeTab: "${activeTab}", activeTopic: "${activeTopicForTutor?.title || 'General'}"`);
      } else {
        console.log(`[AI Tutor Stream] Stream finished successfully. Length: ${accumulatedText.length} chars. Post-stream activeTab: "${activeTab}", activeTopic: "${activeTopicForTutor?.title || 'General'}"`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[AI Tutor] Tutor message error handled safely. Current activeTab: "${activeTab}":`, err);
      // Only show error placeholder if no response text was accumulated at all
      setChatMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMsgId && !msg.content.trim()) {
            return {
              ...msg,
              content: "I encountered a brief connection delay. Please tap below to retry or choose another quick action.",
            };
          }
          return msg;
        })
      );
    }
  };

  // Quiz operations
  const handleOpenQuiz = (topic?: RoadmapTopic | string) => {
    if (typeof topic === 'string') {
      const found = allTopics.find((t) => t.title.toLowerCase() === topic.toLowerCase()) || null;
      setQuizInitialTopic(found);
    } else {
      setQuizInitialTopic(topic || null);
    }
    setShowQuizModal(true);
  };

  const handleSaveQuizResult = (result: QuizResult) => {
    setQuizzes((prev) => [result, ...prev]);
    const updatedStreak = updateStreakOnStudy();
    setStreakData(updatedStreak);
  };

  // Rebalance Schedule action (for missed days or pacing adjustment)
  const handleRebalanceSchedule = async (): Promise<string> => {
    try {
      const res = await fetch('/api/ai/adjust-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missedDaysCount: 2,
          currentTasks: tasks,
          userProfile: profile,
        }),
      });

      const data = await res.json();
      if (roadmap && profile) {
        // Regenerate clean today tasks based on actual roadmap progress
        const freshTasks = generateInitialTasks(roadmap, profile, sessions, quizzes);
        setTasks(freshTasks);
      }
      return data.message || 'Schedule smoothly recalibrated for optimal consistency!';
    } catch (err) {
      if (roadmap && profile) {
        const freshTasks = generateInitialTasks(roadmap, profile, sessions, quizzes);
        setTasks(freshTasks);
      }
      return 'Plan adjusted. Keep a steady pace today without worrying about past days.';
    }
  };

  // Handle start structured lesson
  const handleStartLesson = (
    topic: RoadmapTopic | { id: string; title: string; description?: string; difficulty?: string },
    task?: RoadmapTask
  ) => {
    setActiveLessonTopic(topic);
    setActiveLessonTask(task || null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handle complete lesson topic
  const handleCompleteLessonTopic = (topicId: string, timeSpentMinutes: number) => {
    if (roadmap) {
      const updated = {
        ...roadmap,
        years: roadmap.years.map((y) => ({
          ...y,
          periods: y.periods.map((p) => ({
            ...p,
            months: p.months.map((m) => ({
              ...m,
              weeks: m.weeks.map((w) => ({
                ...w,
                topics: w.topics.map((t) =>
                  t.id === topicId ? { ...t, completed: true, masteryLevel: 100 } : t
                ),
              })),
            })),
          })),
        })),
        lastUpdated: new Date().toISOString(),
      };
      setRoadmap(updated);
      saveStoredRoadmap(updated);
    }

    setTasks((prev) => {
      const updatedTasks = prev.map((t) =>
        t.topicId === topicId || (activeLessonTask && t.id === activeLessonTask.id)
          ? { ...t, completed: true }
          : t
      );
      saveStoredTasks(updatedTasks);
      return updatedTasks;
    });

    const foundTopic = allTopics.find((t) => t.id === topicId);
    const newSession: StudySession = {
      id: `sess-${Date.now()}`,
      topicId,
      topicTitle: foundTopic?.title || activeLessonTopic?.title || 'Structured Lesson',
      durationMinutes: timeSpentMinutes || 30,
      timestamp: new Date().toISOString(),
      notes: 'Completed full structured lesson with explanation, video, code walkthrough, and practice.',
      sessionType: 'focus',
    };
    setSessions((prev) => {
      const updatedSessions = [newSession, ...prev];
      saveStoredSessions(updatedSessions);
      return updatedSessions;
    });

    const updatedStreak = updateStreakOnStudy();
    setStreakData(updatedStreak);
  };

  const handleCompleteLessonTask = (taskId: string) => {
    setTasks((prev) => {
      const updatedTasks = prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t));
      saveStoredTasks(updatedTasks);
      return updatedTasks;
    });
  };

  // Reset Progress: Reset completed topics, sessions, streak/stats, keep profile & roadmap
  const handleResetProgress = () => {
    if (roadmap) {
      const resetRoadmap: Roadmap = {
        ...roadmap,
        years: roadmap.years.map((y) => ({
          ...y,
          periods: y.periods.map((p) => ({
            ...p,
            months: p.months.map((m) => ({
              ...m,
              weeks: m.weeks.map((w) => ({
                ...w,
                topics: w.topics.map((t) => ({
                  ...t,
                  completed: false,
                  masteryLevel: 0,
                  completedAt: undefined,
                })),
              })),
            })),
          })),
        })),
        lastUpdated: new Date().toISOString(),
      };
      setRoadmap(resetRoadmap);
      saveStoredRoadmap(resetRoadmap);

      const freshTasks = profile ? generateInitialTasks(resetRoadmap, profile, [], []) : [];
      setTasks(freshTasks);
      saveStoredTasks(freshTasks);
    }

    setSessions([]);
    saveStoredSessions([]);

    setQuizzes([]);
    saveStoredQuizzes([]);

    const initialStreak: StreakData = { currentStreak: 1, longestStreak: 1, lastStudyDate: '' };
    setStreakData(initialStreak);
    try {
      localStorage.setItem('studymate_streak_info', JSON.stringify(initialStreak));
    } catch (e) {
      console.error(e);
    }

    setShowSettingsModal(false);
  };

  // Reset Roadmap: Regenerate structured roadmap from profile, keep basic profile
  const handleResetRoadmap = () => {
    if (!profile) return;

    const duration = Math.max(1, Math.min(4, Math.round(profile.durationYears || 3)));
    const dailyHours = Number(profile.dailyHours) || 1.5;
    const studyDaysCount = Array.isArray(profile.studyDays) ? profile.studyDays.length : 5;

    const freshRoadmap = buildProceduralCurriculum(
      profile.subject || 'Computer Science & Engineering',
      profile.currentLevel || 'Beginner',
      profile.mainGoal || 'Mastery',
      duration,
      dailyHours,
      studyDaysCount
    );

    setRoadmap(freshRoadmap);
    saveStoredRoadmap(freshRoadmap);

    const freshTasks = generateInitialTasks(freshRoadmap, profile, [], []);
    setTasks(freshTasks);
    saveStoredTasks(freshTasks);

    setSessions([]);
    saveStoredSessions([]);
    setQuizzes([]);
    saveStoredQuizzes([]);

    const initialStreak: StreakData = { currentStreak: 1, longestStreak: 1, lastStudyDate: '' };
    setStreakData(initialStreak);
    try {
      localStorage.setItem('studymate_streak_info', JSON.stringify(initialStreak));
    } catch (e) {
      console.error(e);
    }

    setActiveLessonTopic(null);
    setActiveLessonTask(null);
    setShowSettingsModal(false);
    setActiveTab('learn');
  };

  // Clear All Data: Remove all local storage, restart onboarding
  const handleClearAllData = () => {
    clearAllData();
    setProfile(null);
    setRoadmap(null);
    setTasks([]);
    setSessions([]);
    setQuizzes([]);
    setChatMessages([]);
    setStreakData({ currentStreak: 1, longestStreak: 1, lastStudyDate: '' });
    setActiveLessonTopic(null);
    setActiveLessonTask(null);
    setActiveTopicForTutor(null);
    setShowSettingsModal(false);
    setShowTimerModal(false);
    setShowQuickStudyModal(false);
    setShowQuizModal(false);
    setActiveTab('home');
  };

  // If user has not completed onboarding, show clean onboarding wizard
  if (!profile || !profile.onboardingCompleted || !roadmap) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  const currentThemeConfig = THEMES[theme] || THEMES.clean;

  return (
    <div className={`min-h-screen ${currentThemeConfig.classes.appBg} ${currentThemeConfig.classes.textPrimary} flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-400 pb-20 md:pb-6 transition-colors duration-200`}>
      {/* Top Navigation Bar */}
      <Navbar
        profile={profile}
        streakData={streakData}
        theme={theme}
        onSelectTheme={handleSelectTheme}
        onOpenSettings={() => {
          setShowSettingsModal(true);
        }}
        onOpenQuickStudy={() => {
          setShowQuickStudyModal(true);
        }}
        onOpenTimer={() => handleStartTimer()}
      />

      {/* Main Body Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          roadmapGoal={profile.mainGoal}
          completionPercent={completionPercent}
          theme={theme}
        />

        {/* Dynamic Main View Screen */}
        <main className="flex-1 min-w-0">
          <ErrorBoundary>
            {activeLessonTopic ? (
              <LessonScreen
                topic={activeLessonTopic}
                task={activeLessonTask}
                profile={profile}
                allTopics={allTopics}
                onStartNextLesson={(nextTopic) => {
                  handleStartLesson(nextTopic);
                }}
                onCompleteTopic={handleCompleteLessonTopic}
                onCompleteTask={handleCompleteLessonTask}
                onBack={() => {
                  setActiveLessonTopic(null);
                  setActiveLessonTask(null);
                }}
                onOpenTutorWithTopic={(topicTitle) => {
                  setActiveLessonTopic(null);
                  setActiveLessonTask(null);
                  const found = allTopics.find(
                    (t) => t.title.toLowerCase() === topicTitle.toLowerCase()
                  );
                  setActiveTopicForTutor(found || null);
                  handleSelectTab('tutor');
                }}
              />
            ) : (
              <>
                {activeTab === 'home' && (
                  <HomeScreen
                    profile={profile}
                    roadmap={roadmap}
                    tasks={tasks}
                    streakData={streakData}
                    todayCompletedMinutes={todayCompletedMinutes}
                    onToggleTask={handleToggleTask}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    onStartLesson={handleStartLesson}
                    onStartTimer={handleStartTimer}
                    onOpenQuickStudy={() => {
                      setShowQuickStudyModal(true);
                    }}
                    onOpenTutor={(topic) => {
                      setActiveTopicForTutor(topic || null);
                      handleSelectTab('tutor');
                    }}
                    onOpenQuiz={(topic) => handleOpenQuiz(topic)}
                    onNavigateToLearn={() => handleSelectTab('subjects')}
                    onRebalanceSchedule={handleRebalanceSchedule}
                  />
                )}

                {(activeTab === 'subjects' || activeTab === 'learn') && (
                  <LearnScreen
                    roadmap={roadmap}
                    profile={profile}
                    onUpdateRoadmap={setRoadmap}
                    onStartLesson={(topic) => handleStartLesson(topic)}
                    onOpenTutorForTopic={(topic) => {
                      setActiveTopicForTutor(topic);
                      handleSelectTab('tutor');
                    }}
                    onOpenQuizForTopic={(topic) => handleOpenQuiz(topic)}
                    onOpenTimerForTopic={(topic) => handleStartTimer(undefined, topic)}
                  />
                )}

                {activeTab === 'planner' && (
                  <PlannerScreen
                    profile={profile}
                    roadmap={roadmap}
                    tasks={tasks}
                    theme={theme}
                    todayCompletedMinutes={todayCompletedMinutes}
                    onToggleTask={handleToggleTask}
                    onAddTask={handleAddTask}
                    onStartLesson={handleStartLesson}
                    onStartTimer={handleStartTimer}
                    onRebalanceSchedule={handleRebalanceSchedule}
                  />
                )}

                {activeTab === 'focus' && (
                  <FocusScreen
                    profile={profile}
                    allTopics={allTopics}
                    tasks={tasks}
                    theme={theme}
                    onSessionComplete={handleSessionComplete}
                  />
                )}

                {activeTab === 'notes' && (
                  <NotesScreen
                    notes={notes}
                    profile={profile}
                    theme={theme}
                    onSaveNotes={handleSaveNotes}
                  />
                )}

                {activeTab === 'goals' && (
                  <GoalsScreen
                    goals={goals}
                    profile={profile}
                    roadmap={roadmap}
                    theme={theme}
                    onSaveGoals={handleSaveGoals}
                  />
                )}

                {activeTab === 'tutor' && (
                  <TutorScreen
                    profile={profile}
                    allTopics={allTopics}
                    activeTopic={activeTopicForTutor}
                    onSelectTopic={setActiveTopicForTutor}
                    messages={chatMessages}
                    onSendMessage={handleSendMessageToTutor}
                    onClearChat={() => setChatMessages([])}
                    onOpenQuiz={(topic) => handleOpenQuiz(topic)}
                    onBack={() => handleSelectTab('home')}
                  />
                )}

                {activeTab === 'progress' && (
                  <ProgressScreen
                    profile={profile}
                    roadmap={roadmap}
                    sessions={sessions}
                    quizzes={quizzes}
                    streakData={streakData}
                    onOpenQuizForTopic={(topicTitle) => handleOpenQuiz(topicTitle)}
                    onOpenTutorForTopic={(topicTitle) => {
                      const found = allTopics.find(
                        (t) => t.title.toLowerCase() === topicTitle.toLowerCase()
                      );
                      setActiveTopicForTutor(found || null);
                      handleSelectTab('tutor');
                    }}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsScreen
                    profile={profile}
                    currentTheme={theme}
                    onSelectTheme={handleSelectTheme}
                    onSaveProfile={(updated) => setProfile(updated)}
                    onRebalanceSchedule={handleRebalanceSchedule}
                    onResetProgress={handleResetProgress}
                    onResetRoadmap={handleResetRoadmap}
                    onClearAllData={handleClearAllData}
                  />
                )}
              </>
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        theme={theme}
      />

      {/* Focus Timer Modal */}
      {showTimerModal && (
        <FocusTimerModal
          initialTopic={timerInitialTopic}
          initialTask={timerInitialTask}
          allTopics={allTopics}
          onClose={() => setShowTimerModal(false)}
          onSessionComplete={handleSessionComplete}
        />
      )}

      {/* "I have limited time" Quick Study Modal */}
      {showQuickStudyModal && (
        <QuickStudyModal
          profile={profile}
          currentTopic={allTopics.find((t) => !t.completed) || allTopics[0]}
          onClose={() => setShowQuickStudyModal(false)}
          onStartTimerWithTopic={(topic, durationMins) => {
            setShowQuickStudyModal(false);
            setTimerInitialTopic(topic);
            setShowTimerModal(true);
          }}
        />
      )}

      {/* AI Quiz Modal */}
      {showQuizModal && (
        <QuizModal
          profile={profile}
          initialTopic={quizInitialTopic}
          allTopics={allTopics}
          onClose={() => setShowQuizModal(false)}
          onSaveQuizResult={handleSaveQuizResult}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          profile={profile}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
          onClose={() => setShowSettingsModal(false)}
          onSaveProfile={(updated) => {
            setProfile(updated);
          }}
          onRebalanceSchedule={handleRebalanceSchedule}
          onResetProgress={handleResetProgress}
          onResetRoadmap={handleResetRoadmap}
          onClearAllData={handleClearAllData}
        />
      )}
    </div>
  );
}
