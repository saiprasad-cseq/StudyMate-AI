import React, { useState } from 'react';
import {
  Target,
  Flag,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Trophy,
  Sparkles,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { StudyGoal, UserProfile, Roadmap, AppTheme } from '../types';
import { THEMES } from '../lib/theme';

interface GoalsScreenProps {
  goals: StudyGoal[];
  profile: UserProfile | null;
  roadmap: Roadmap | null;
  theme?: AppTheme;
  onSaveGoals: (goals: StudyGoal[]) => void;
}

export const GoalsScreen: React.FC<GoalsScreenProps> = ({
  goals,
  profile,
  roadmap,
  theme = 'clean',
  onSaveGoals,
}) => {
  const currentTheme = THEMES[theme] || THEMES.clean;
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'course' | 'exam' | 'skill' | 'project' | 'habit'>('course');
  const [newTargetDate, setNewTargetDate] = useState('');

  // Target Date countdown calculation
  const targetDateStr = profile?.targetDate;
  let daysRemaining: number | null = null;
  if (targetDateStr) {
    const diffTime = new Date(targetDateStr).getTime() - Date.now();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const updated = goals.map((g) => {
      if (g.id !== goalId) return g;
      const updatedMilestones = g.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const progress = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);
      return {
        ...g,
        milestones: updatedMilestones,
        progress,
        completed: progress === 100,
      };
    });
    onSaveGoals(updated);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: StudyGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetDate: newTargetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      completed: false,
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Core Foundations Completed', completed: false },
        { id: `m-${Date.now()}-2`, title: 'Practical Exercises Done', completed: false },
        { id: `m-${Date.now()}-3`, title: 'Final Review & Mastery Check', completed: false },
      ],
    };

    onSaveGoals([...goals, newGoal]);
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto ${currentTheme.classes.textPrimary}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${currentTheme.classes.accentBadge}`}>
              Milestones & Vision
            </span>
            <span className={`text-xs font-medium ${currentTheme.classes.textMuted}`}>
              Long-Term Outcomes
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Goals & Milestones</h1>
          <p className={`text-sm ${currentTheme.classes.textSecondary} mt-1`}>
            Track high-level achievements, semester targets, and exam countdowns.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold ${currentTheme.classes.primaryBtn} transition-all self-start sm:self-auto`}
        >
          <Plus className="w-4 h-4" />
          <span>New Target Goal</span>
        </button>
      </div>

      {/* Primary Hero Goal Spotlight */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${currentTheme.classes.card} relative overflow-hidden space-y-4 shadow-md`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${currentTheme.classes.accentBadge} w-fit px-2.5 py-1 rounded-md`}>
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Primary North Star Goal
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-2">
              {profile?.mainGoal || 'Master Target Subject Curriculum'}
            </h2>
            <p className={`text-xs sm:text-sm ${currentTheme.classes.textSecondary} leading-relaxed`}>
              Target Subject: <strong className="font-bold">{profile?.subject}</strong> • Commitment:{' '}
              {profile?.durationYears || 3} Year Program ({profile?.dailyHours || 1.5}h daily)
            </p>
          </div>

          {daysRemaining !== null && (
            <div className={`p-4 rounded-2xl border text-center shrink-0 min-w-[140px] ${currentTheme.classes.accentBadge}`}>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">{daysRemaining}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-0.5">
                Days Remaining
              </div>
              <div className="text-[10px] opacity-70 mt-1">
                Target: {new Date(targetDateStr!).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Active Goals & Sub-Milestones</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-5 rounded-2xl border transition-all space-y-4 ${currentTheme.classes.card}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${currentTheme.classes.accentBadge}`}>
                    {goal.category}
                  </span>
                  <h3 className="text-base font-bold mt-1.5">{goal.title}</h3>
                  <p className={`text-xs ${currentTheme.classes.textMuted} flex items-center gap-1 mt-1`}>
                    <Calendar className="w-3 h-3" /> Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-extrabold">{goal.progress}%</span>
                  <div className="text-[10px] opacity-70">Completed</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>

              {/* Milestones checklist */}
              <div className="space-y-2 pt-1 border-t border-slate-200/40 dark:border-slate-800">
                <div className={`text-[11px] font-bold uppercase tracking-wider ${currentTheme.classes.textMuted}`}>
                  Milestones
                </div>
                {goal.milestones.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleToggleMilestone(goal.id, m.id)}
                    className="w-full flex items-center gap-2.5 text-xs text-left group transition-colors"
                  >
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-slate-600" />
                    )}
                    <span className={`flex-1 ${m.completed ? 'line-through opacity-60' : 'font-medium'}`}>
                      {m.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl border p-6 space-y-4 ${currentTheme.classes.card} shadow-2xl`}>
            <h3 className="text-lg font-bold">Add Target Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs font-medium">
              <div>
                <label className="font-semibold block mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Dynamic Programming Curriculum"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
                  >
                    <option value="course">Course</option>
                    <option value="exam">Exam</option>
                    <option value="skill">Skill</option>
                    <option value="project">Project</option>
                    <option value="habit">Habit</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
                  />
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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
