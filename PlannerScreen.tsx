import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  Sparkles,
  Plus,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Target,
} from 'lucide-react';
import { RoadmapTask, UserProfile, Roadmap, RoadmapTopic, AppTheme } from '../types';
import { THEMES } from '../lib/theme';

interface PlannerScreenProps {
  profile: UserProfile | null;
  roadmap: Roadmap | null;
  tasks: RoadmapTask[];
  theme?: AppTheme;
  todayCompletedMinutes: number;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Partial<RoadmapTask>) => void;
  onStartLesson: (topic: RoadmapTopic | { id: string; title: string }) => void;
  onStartTimer: (task?: RoadmapTask) => void;
  onRebalanceSchedule: () => Promise<string>;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const PlannerScreen: React.FC<PlannerScreenProps> = ({
  profile,
  roadmap,
  tasks,
  theme = 'clean',
  todayCompletedMinutes,
  onToggleTask,
  onAddTask,
  onStartLesson,
  onStartTimer,
  onRebalanceSchedule,
}) => {
  const currentTheme = THEMES[theme] || THEMES.clean;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const day = new Date().getDay(); // 0 is Sunday
    return day === 0 ? 6 : day - 1;
  });
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceMsg, setRebalanceMsg] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMinutes, setNewTaskMinutes] = useState(30);
  const [newTaskCategory, setNewTaskCategory] = useState<'learn' | 'practice' | 'quiz' | 'revision'>('learn');

  const selectedDayName = DAYS[selectedDayIndex];

  // Daily target minutes from profile
  const targetMinutes = Math.round((profile?.dailyHours || 1.5) * 60);
  const plannedMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0);
  const completedTasks = tasks.filter((t) => t.completed);

  const handleRebalance = async () => {
    setIsRebalancing(true);
    setRebalanceMsg(null);
    try {
      const msg = await onRebalanceSchedule();
      setRebalanceMsg(msg);
    } finally {
      setIsRebalancing(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      title: newTaskTitle.trim(),
      estimatedMinutes: Number(newTaskMinutes) || 30,
      category: newTaskCategory,
      completed: false,
      date: todayDateStr,
      topicTitle: profile?.subject || 'Study Task',
      topicId: 'manual-task',
    });
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto ${currentTheme.classes.textPrimary}`}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${currentTheme.classes.accentBadge}`}>
              V1 Planner
            </span>
            <span className={`text-xs font-medium ${currentTheme.classes.textMuted}`}>
              Structured Study Schedule
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Study Planner</h1>
          <p className={`text-sm ${currentTheme.classes.textSecondary} mt-1`}>
            Keep consistent with structured daily study intervals and smart pace recalibration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold ${currentTheme.classes.secondaryBtn} transition-all`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Study Block</span>
          </button>

          <button
            onClick={handleRebalance}
            disabled={isRebalancing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${currentTheme.classes.primaryBtn} transition-all disabled:opacity-50`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRebalancing ? 'Recalibrating...' : 'Recalibrate Plan'}</span>
          </button>
        </div>
      </div>

      {rebalanceMsg && (
        <div className={`p-4 rounded-2xl border text-xs font-medium leading-relaxed ${currentTheme.classes.accentBadge}`}>
          {rebalanceMsg}
        </div>
      )}

      {/* Daily Pacing Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className={`p-4 rounded-2xl border ${currentTheme.classes.card}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${currentTheme.classes.textMuted}`}>Daily Target</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{targetMinutes}</span>
            <span className={`text-xs ${currentTheme.classes.textMuted}`}>min / day</span>
          </div>
          <p className={`text-xs ${currentTheme.classes.textSecondary} mt-1`}>
            Based on {profile?.dailyHours || 1.5}h daily commitment
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${currentTheme.classes.card}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${currentTheme.classes.textMuted}`}>Studied Today</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{todayCompletedMinutes}</span>
            <span className={`text-xs ${currentTheme.classes.textMuted}`}>of {targetMinutes} min</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200/40 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((todayCompletedMinutes / (targetMinutes || 1)) * 100))}%` }}
            />
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${currentTheme.classes.card}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${currentTheme.classes.textMuted}`}>Tasks Status</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {completedTasks.length} / {tasks.length}
            </span>
            <span className={`text-xs ${currentTheme.classes.textMuted}`}>completed</span>
          </div>
          <p className={`text-xs ${currentTheme.classes.textSecondary} mt-1`}>
            {tasks.length - completedTasks.length} tasks remaining for today
          </p>
        </div>
      </div>

      {/* Weekday Selector */}
      <div className={`p-4 rounded-2xl border ${currentTheme.classes.card} space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold">Weekly Schedule View</h3>
          </div>
          <span className={`text-xs font-semibold ${currentTheme.classes.textMuted}`}>
            Active day: {selectedDayName}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            const isToday = (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) === idx;
            const isStudyDay = profile?.studyDays?.includes(day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDayIndex(idx)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold text-center transition-all border ${
                  isSelected
                    ? currentTheme.classes.primaryBtn
                    : isToday
                    ? 'border-indigo-500/50 bg-indigo-500/10'
                    : `border-transparent hover:${currentTheme.classes.cardHover}`
                }`}
              >
                <div>{day}</div>
                <div className="text-[10px] mt-0.5 opacity-80">
                  {isToday ? 'Today' : isStudyDay ? 'Study' : 'Rest'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scheduled Tasks Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Today's Scheduled Curriculum Tasks</h2>
          <span className={`text-xs ${currentTheme.classes.textMuted}`}>
            {tasks.length} structured study blocks
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border ${currentTheme.classes.card} space-y-3`}>
            <Calendar className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-sm font-semibold">No tasks scheduled for this day.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${currentTheme.classes.primaryBtn}`}
            >
              Add First Task
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.map((task) => {
              const isCompleted = task.completed;
              return (
                <div
                  key={task.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    currentTheme.classes.card
                  } ${isCompleted ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-sm truncate ${
                            isCompleted ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.category && (
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${currentTheme.classes.accentBadge}`}>
                            {task.category}
                          </span>
                        )}
                        {task.isRevision && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                            <RotateCcw className="w-2.5 h-2.5" /> Revision
                          </span>
                        )}
                      </div>

                      <div className={`flex items-center gap-3 text-xs ${currentTheme.classes.textMuted} mt-1`}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {task.estimatedMinutes || 30} min
                        </span>
                        {task.topicTitle && (
                          <span className="truncate flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {task.topicTitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onStartTimer(task)}
                      className={`p-2 rounded-xl ${currentTheme.classes.secondaryBtn} transition-all`}
                      title="Start Focus Timer for this task"
                    >
                      <Play className="w-3.5 h-3.5 text-indigo-400" />
                    </button>

                    <button
                      onClick={() =>
                        onStartLesson({
                          id: task.topicId || task.id,
                          title: task.topicTitle || task.title,
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${currentTheme.classes.secondaryBtn} transition-all hidden sm:block`}
                    >
                      Open Lesson
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl border p-6 space-y-4 ${currentTheme.classes.card} shadow-2xl`}>
            <h3 className="text-lg font-bold">Add Study Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs font-medium">
              <div>
                <label className="font-semibold block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Binary Search Trees"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    step="5"
                    value={newTaskMinutes}
                    onChange={(e) => setNewTaskMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
                  >
                    <option value="learn">Learn</option>
                    <option value="practice">Practice</option>
                    <option value="quiz">Quiz</option>
                    <option value="revision">Revision</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${currentTheme.classes.primaryBtn}`}
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
