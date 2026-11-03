import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  Circle,
  Flame,
  Sparkles,
  Plus,
  Clock,
  Edit2,
  Trash2,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Check,
  Brain,
  HelpCircle,
  RefreshCw,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, Roadmap, RoadmapTask, RoadmapTopic } from '../types';
import { getGreeting, formatTodayDate, formatMinutes } from '../lib/dateUtils';
import { StreakData } from '../lib/storage';

interface HomeScreenProps {
  profile: UserProfile;
  roadmap: Roadmap;
  tasks: RoadmapTask[];
  streakData: StreakData;
  todayCompletedMinutes: number;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: RoadmapTask) => void;
  onEditTask: (task: RoadmapTask) => void;
  onDeleteTask: (taskId: string) => void;
  onStartLesson: (topic: RoadmapTopic | { id: string; title: string; description?: string; difficulty?: string }, task?: RoadmapTask) => void;
  onStartTimer: (task?: RoadmapTask, topic?: RoadmapTopic) => void;
  onOpenQuickStudy: () => void;
  onOpenTutor: (topic?: RoadmapTopic) => void;
  onOpenQuiz: (topic?: RoadmapTopic) => void;
  onNavigateToLearn: () => void;
  onRebalanceSchedule?: () => Promise<string>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  roadmap,
  tasks,
  streakData,
  todayCompletedMinutes,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onStartLesson,
  onStartTimer,
  onOpenQuickStudy,
  onOpenTutor,
  onOpenQuiz,
  onNavigateToLearn,
  onRebalanceSchedule,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'learn' | 'practice' | 'quiz' | 'revision'>('learn');
  const [newTaskMinutes, setNewTaskMinutes] = useState(30);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceMessage, setRebalanceMessage] = useState<string | null>(null);

  // Edit task state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMinutes, setEditMinutes] = useState(30);

  const goalMinutes = Math.round((Number(profile.dailyHours) || 1.5) * 60);
  const plannedTotalMinutes = Math.max(
    tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0),
    goalMinutes
  );

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const progressPercent = plannedTotalMinutes > 0
    ? Math.min(100, Math.round((todayCompletedMinutes / plannedTotalMinutes) * 100))
    : 0;

  // Flatten all topics for lookup
  const allTopics: RoadmapTopic[] = [];
  roadmap.years?.forEach((y) =>
    y.periods?.forEach((p) =>
      p.months?.forEach((m) =>
        m.weeks?.forEach((w) => w.topics?.forEach((top) => allTopics.push(top)))
      )
    )
  );

  const completedTopics = allTopics.filter((t) => t.completed);
  const currentIncompleteTopic = allTopics.find((t) => !t.completed) || allTopics[0];
  const overallProgress = allTopics.length > 0
    ? Math.round((completedTopics.length / allTopics.length) * 100)
    : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    let formattedTitle = newTaskTitle.trim();
    if (!formattedTitle.toLowerCase().startsWith('learn:') &&
        !formattedTitle.toLowerCase().startsWith('practice:') &&
        !formattedTitle.toLowerCase().startsWith('quiz:') &&
        !formattedTitle.toLowerCase().startsWith('revision:')) {
      const prefix = newTaskCategory.charAt(0).toUpperCase() + newTaskCategory.slice(1);
      formattedTitle = `${prefix}: ${formattedTitle}`;
    }

    const newTask: RoadmapTask = {
      id: `task-${Date.now()}`,
      topicId: currentIncompleteTopic?.id || 'general',
      topicTitle: currentIncompleteTopic?.title || profile.subject,
      title: formattedTitle,
      category: newTaskCategory,
      estimatedMinutes: Number(newTaskMinutes) || 30,
      completed: false,
      date: new Date().toISOString().split('T')[0],
    };

    onAddTask(newTask);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const handleStartEdit = (task: RoadmapTask) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditMinutes(task.estimatedMinutes);
  };

  const handleSaveEdit = (task: RoadmapTask) => {
    if (!editTitle.trim()) return;
    onEditTask({
      ...task,
      title: editTitle.trim(),
      estimatedMinutes: Number(editMinutes) || 30,
    });
    setEditingTaskId(null);
  };

  const handleRunRebalance = async () => {
    if (!onRebalanceSchedule || isRebalancing) return;
    setIsRebalancing(true);
    setRebalanceMessage(null);
    try {
      const msg = await onRebalanceSchedule();
      setRebalanceMessage(msg);
      setTimeout(() => setRebalanceMessage(null), 4000);
    } catch (e) {
      setRebalanceMessage('Plan rebalanced to your optimal daily pace.');
      setTimeout(() => setRebalanceMessage(null), 4000);
    } finally {
      setIsRebalancing(false);
    }
  };

  // Helper for task category icon & styling
  const getTaskCategoryDetails = (title: string, category?: string) => {
    const lower = title.toLowerCase();
    if (category === 'learn' || lower.startsWith('learn:')) {
      return {
        badge: 'Learn',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: BookOpen,
        iconClass: 'text-blue-600',
      };
    }
    if (category === 'practice' || lower.startsWith('practice:')) {
      return {
        badge: 'Practice',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: Brain,
        iconClass: 'text-emerald-600',
      };
    }
    if (category === 'quiz' || lower.startsWith('quiz:')) {
      return {
        badge: 'Quiz',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: HelpCircle,
        iconClass: 'text-purple-600',
      };
    }
    if (category === 'revision' || lower.startsWith('revision:')) {
      return {
        badge: 'Revision',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: RotateCcw,
        iconClass: 'text-amber-600',
      };
    }
    return {
      badge: 'Task',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: CheckCircle2,
      iconClass: 'text-slate-600',
    };
  };

  // Find first uncompleted task for the primary start action
  const nextPendingTask = tasks.find((t) => !t.completed);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Greeting & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting(profile.name)}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">{formatTodayDate()}</p>
        </div>

        {/* Consistency Streak Pill */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-2xs">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900">{streakData.currentStreak} Day Streak</div>
            <div className="text-[10px] text-slate-400 font-medium">Consistent daily progress</div>
          </div>
        </div>
      </div>

      {/* 2. Today's Plan & Main Action Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wide uppercase">
                Today's Plan
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                • {profile.subject}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today's goal:
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {goalMinutes} minutes
              </div>
            </div>

            {/* Metrics: Completed X / Y tasks & Study time: X / Y minutes */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Completed: <strong className="text-slate-900">{completedTasksCount}</strong> / {totalTasksCount} tasks
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>
                  Study time: <strong className="text-slate-900">{todayCompletedMinutes}</strong> / {goalMinutes} minutes
                </span>
              </div>
            </div>
          </div>

          {/* Prominent Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              id="start-todays-study-btn"
              onClick={() => {
                const targetTopic = currentIncompleteTopic || {
                  id: 'top-1',
                  title: 'Variables and Data Types',
                  description: 'Core memory representation, primitives, and type casting mechanics.',
                  difficulty: profile.currentLevel || 'Beginner',
                };
                if (nextPendingTask) {
                  const lower = nextPendingTask.title.toLowerCase();
                  if (lower.startsWith('quiz:') || nextPendingTask.category === 'quiz') {
                    onOpenQuiz(currentIncompleteTopic);
                  } else {
                    onStartLesson(targetTopic, nextPendingTask);
                  }
                } else {
                  onStartLesson(targetTopic);
                }
              }}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm tracking-wide transition-all shadow-md active:scale-98 cursor-pointer group"
            >
              <BookOpen className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
              <span>START TODAY'S LESSON</span>
            </button>

            <button
              onClick={onOpenQuickStudy}
              className="px-4 py-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              title="I have limited time — Quick study sprint"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Limited Time?</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Daily Goal Completion</span>
            <span className="text-slate-900">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Adaptive AI Guidance Note */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-slate-700 leading-relaxed font-medium">
              <span className="font-bold text-slate-900">Today's Focus: </span>
              {currentIncompleteTopic
                ? `Mastering "${currentIncompleteTopic.title}" with structured concept learning, problem practice, and diagnostic checks.`
                : roadmap.aiRecommendation || 'On track with your long-term milestones!'}
            </div>
          </div>

          {onRebalanceSchedule && (
            <button
              onClick={handleRunRebalance}
              disabled={isRebalancing}
              className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-2.5 py-1 rounded-xl border border-slate-200"
              title="Smoothly rebalance workload without cramming"
            >
              <RefreshCw className={`w-3 h-3 ${isRebalancing ? 'animate-spin' : ''}`} />
              <span>{isRebalancing ? 'Rebalancing...' : 'Rebalance'}</span>
            </button>
          )}
        </div>

        {rebalanceMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-in fade-in">
            {rebalanceMessage}
          </div>
        )}
      </div>

      {/* 3. Today's Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Today's Tasks</h2>
            <p className="text-xs text-slate-400">
              Personalized day-to-day study workflow based on your roadmap and recent performance
            </p>
          </div>

          <button
            id="add-task-btn"
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Inline Add Task Form */}
        {isAddingTask && (
          <form
            onSubmit={handleCreateTask}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-500">Category:</span>
              <div className="flex gap-1.5">
                {(['learn', 'practice', 'quiz', 'revision'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewTaskCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      newTaskCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Variables & Types — 8 Practice Questions"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
            />

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated Time:</span>
                <select
                  value={newTaskMinutes}
                  onChange={(e) => setNewTaskMinutes(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold"
                >
                  <option value={10}>10 min</option>
                  <option value={15}>15 min</option>
                  <option value={20}>20 min</option>
                  <option value={30}>30 min</option>
                  <option value={40}>40 min</option>
                  <option value={50}>50 min</option>
                  <option value={60}>60 min</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors disabled:opacity-40"
                >
                  Save Task
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Structured Task List */}
        <div className="space-y-3">
          {tasks.map((task, index) => {
            const isEditing = editingTaskId === task.id;
            const categoryMeta = getTaskCategoryDetails(task.title, task.category);
            const CategoryIcon = categoryMeta.icon;

            if (isEditing) {
              return (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3"
                >
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Minutes:</span>
                      <input
                        type="number"
                        min="5"
                        max="180"
                        value={editMinutes}
                        onChange={(e) => setEditMinutes(Number(e.target.value))}
                        className="w-20 px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="px-3 py-1.5 text-slate-500 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(task)}
                        className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            const lowerTitle = task.title.toLowerCase();
            const isQuizTask = lowerTitle.startsWith('quiz:') || task.category === 'quiz';
            const isRevisionTask = lowerTitle.startsWith('revision:') || task.isRevision || task.category === 'revision';

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                  task.completed
                    ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Left: Task index number + Checkbox + Title & Details */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  {/* Task number marker */}
                  <span className="text-xs font-black text-slate-400 w-5 shrink-0 pt-0.5 sm:pt-0">
                    {index + 1}.
                  </span>

                  {/* Completion Toggle */}
                  <button
                    onClick={() => {
                      onToggleTask(task.id);
                      if (!task.completed) {
                        confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
                      }
                    }}
                    className="shrink-0 transition-transform active:scale-90 pt-0.5 sm:pt-0"
                    title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-slate-600" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${categoryMeta.badgeClass}`}>
                        {categoryMeta.badge}
                      </span>
                      <span
                        className={`text-sm font-bold tracking-tight truncate ${
                          task.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {task.estimatedMinutes} min
                      </span>
                      {task.notes && (
                        <span className="text-slate-400 truncate hidden md:inline">
                          • {task.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!task.completed && (
                    <>
                      {isQuizTask ? (
                        <button
                          onClick={() => onOpenQuiz(currentIncompleteTopic)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition-colors cursor-pointer"
                          title="Take Quiz Now"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Take Quiz</span>
                        </button>
                      ) : isRevisionTask ? (
                        <button
                          onClick={() => onOpenQuiz(completedTopics[0] || currentIncompleteTopic)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors cursor-pointer"
                          title="Start Revision Drill"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Revise</span>
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onStartLesson(
                              currentIncompleteTopic || {
                                id: task.topicId || 'top-1',
                                title: task.title.replace(/^(learn|watch|practice|quiz):\s*/i, ''),
                              },
                              task
                            )
                          }
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                          title="Open Structured Lesson"
                        >
                          <BookOpen className="w-3 h-3 fill-white" />
                          <span>Learn</span>
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => handleStartEdit(task)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {tasks.length === 0 && (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">All tasks completed for today!</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Excellent work staying consistent. Take some time to relax, or run a quick 5-minute revision drill below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Smart Spaced Revision Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Smart Spaced Repetition
            </span>
            <h3 className="text-lg font-bold">Quick 5-Minute Concept Retention Check</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              {completedTopics.length > 0
                ? `You recently completed "${completedTopics[0]?.title}". A rapid review today consolidates long-term neural recall.`
                : `Review foundational primitives in ${profile.subject} to build solid confidence before advancing.`}
            </p>
          </div>

          <button
            id="revise-now-btn"
            onClick={() => onOpenQuiz(completedTopics[0] || currentIncompleteTopic)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Revise Now</span>
          </button>
        </div>
      </div>

      {/* 5. Roadmap Progression Summary Card */}
      <div
        onClick={onNavigateToLearn}
        className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Overall Multi-Year Roadmap</h4>
              <p className="text-xs text-slate-400">
                {profile.durationYears}-Year Academic Trajectory: {profile.mainGoal}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              {completedTopics.length} of {allTopics.length} topics mastered
            </span>
            <span className="font-bold text-slate-800">{overallProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(3, overallProgress)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
