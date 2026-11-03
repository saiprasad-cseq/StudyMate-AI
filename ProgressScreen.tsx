import React, { useState } from 'react';
import {
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Calendar,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  HelpCircle,
  FileText
} from 'lucide-react';
import { StudySession, QuizResult, Roadmap, UserProfile } from '../types';
import { StreakData } from '../lib/storage';
import { formatMinutes, getLast7DaysLabels } from '../lib/dateUtils';

interface ProgressScreenProps {
  profile: UserProfile;
  roadmap: Roadmap;
  sessions: StudySession[];
  quizzes: QuizResult[];
  streakData: StreakData;
  onOpenQuizForTopic: (topicTitle: string) => void;
  onOpenTutorForTopic: (topicTitle: string) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  profile,
  roadmap,
  sessions,
  quizzes,
  streakData,
  onOpenQuizForTopic,
  onOpenTutorForTopic,
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'notes' | 'quizzes'>('overview');

  // Compute time stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMinutes = sessions
    .filter((s) => s.timestamp.startsWith(todayStr))
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const weeklyMinutes = sessions
    .filter((s) => new Date(s.timestamp).getTime() >= sevenDaysAgo)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const monthlyMinutes = sessions
    .filter((s) => new Date(s.timestamp).getTime() >= thirtyDaysAgo)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  // Compute 7-day study breakdown for the visual bar chart
  const last7Days = getLast7DaysLabels();
  const dayBuckets = last7Days.map((d) => {
    const mins = sessions
      .filter((s) => s.timestamp.startsWith(d.dateStr))
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    return { ...d, mins };
  });
  const maxDayMins = Math.max(...dayBuckets.map((d) => d.mins), 60);

  // Roadmap topic counts
  let allTopicsCount = 0;
  let completedTopicsCount = 0;
  roadmap.years?.forEach((y) =>
    y.periods?.forEach((p) =>
      p.months?.forEach((m) =>
        m.weeks?.forEach((w) =>
          w.topics?.forEach((t) => {
            allTopicsCount++;
            if (t.completed) completedTopicsCount++;
          })
        )
      )
    )
  );

  const roadmapCompletion = allTopicsCount > 0
    ? Math.round((completedTopicsCount / allTopicsCount) * 100)
    : 0;

  // Aggregate weak areas from all quizzes
  const weakAreasMap = new Map<string, number>();
  quizzes.forEach((q) => {
    q.weakAreas?.forEach((area) => {
      weakAreasMap.set(area, (weakAreasMap.get(area) || 0) + 1);
    });
  });
  const weakAreasList = Array.from(weakAreasMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([area]) => area)
    .slice(0, 5);

  // Milestone achievements
  const achievements = [
    {
      id: 'first-step',
      title: 'Study Journey Begun',
      description: 'Completed onboarding & structured long-term roadmap.',
      unlocked: true,
      icon: Sparkles,
    },
    {
      id: 'first-session',
      title: 'First Study Session',
      description: 'Completed your first focused study timer sprint.',
      unlocked: sessions.length >= 1,
      icon: Clock,
    },
    {
      id: 'streak-3',
      title: 'Consistency Spark',
      description: 'Maintained a 3-day active study streak.',
      unlocked: streakData.longestStreak >= 3,
      icon: Flame,
    },
    {
      id: 'quiz-ace',
      title: 'Active Recall Ace',
      description: 'Scored 80%+ on an AI knowledge diagnostic.',
      unlocked: quizzes.some((q) => q.score / q.total >= 0.8),
      icon: Award,
    },
    {
      id: 'master-5',
      title: 'Curriculum Builder',
      description: 'Mastered 5 or more topics in your roadmap.',
      unlocked: completedTopicsCount >= 5,
      icon: BookOpen,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Analytics & Consistency
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Your Learning Progress
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Real study time tracking, active recall performance, and milestones.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Today
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatMinutes(todayMinutes)}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Daily study focus</p>
        </div>

        {/* Weekly */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            This Week
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatMinutes(weeklyMinutes)}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Past 7 days active</p>
        </div>

        {/* Streak */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Streak
            </span>
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {streakData.currentStreak} Days
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            Best: {streakData.longestStreak} days
          </p>
        </div>

        {/* Topics Mastered */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Mastery
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {completedTopicsCount}/{allTopicsCount}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            {roadmapCompletion}% of master goal
          </p>
        </div>
      </div>

      {/* 7-Day Study Bar Chart */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">7-Day Study Activity</h3>
          <span className="text-xs font-semibold text-slate-400">
            Total: {formatMinutes(weeklyMinutes)}
          </span>
        </div>

        <div className="flex items-end justify-between gap-2 sm:gap-4 h-36 pt-4 pb-1">
          {dayBuckets.map((d, idx) => {
            const heightPercent = maxDayMins > 0 ? (d.mins / maxDayMins) * 100 : 0;
            const isToday = d.dateStr === todayStr;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.mins}m
                </span>
                <div className="w-full max-w-[36px] bg-slate-100 rounded-xl overflow-hidden h-full flex items-end">
                  <div
                    className={`w-full rounded-xl transition-all duration-500 ${
                      isToday ? 'bg-slate-900' : 'bg-slate-700 group-hover:bg-slate-900'
                    }`}
                    style={{ height: `${Math.max(d.mins > 0 ? 12 : 4, heightPercent)}%` }}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    isToday ? 'text-slate-900 font-extrabold' : 'text-slate-400'
                  }`}
                >
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Areas Section (Identified from Quizzes) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900">Recommended Reinforcement Areas</h3>
            <p className="text-xs text-slate-400">
              Identified through quiz diagnostics and self-checks.
            </p>
          </div>
        </div>

        {weakAreasList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {weakAreasList.map((area, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold text-amber-900 truncate">{area}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onOpenTutorForTopic(area)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-900 font-semibold hover:bg-amber-100 transition-colors"
                  >
                    Tutor
                  </button>
                  <button
                    onClick={() => onOpenQuizForTopic(area)}
                    className="px-2.5 py-1 rounded-lg bg-amber-900 text-white font-semibold hover:bg-amber-800 transition-colors"
                  >
                    Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-500 font-medium text-center">
            No weak areas flagged yet. Complete quiz checks in the AI Tutor to identify focus topics!
          </div>
        )}
      </div>

      {/* Achievements / Milestones */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Milestone Achievements</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  ach.unlocked
                    ? 'bg-slate-50/60 border-slate-200 text-slate-800'
                    : 'bg-slate-50/20 border-slate-200/60 opacity-40 text-slate-400'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    ach.unlocked ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold text-slate-900">{ach.title}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{ach.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Session Log & Notes */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Study Sessions & Notes</h3>
          <span className="text-xs text-slate-400 font-medium">{sessions.length} total</span>
        </div>

        <div className="space-y-2.5">
          {sessions.slice(0, 8).map((s) => (
            <div
              key={s.id}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{s.topicTitle}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold">
                    {s.durationMinutes} min
                  </span>
                </div>
                {s.notes && (
                  <p className="text-slate-600 font-medium italic">"{s.notes}"</p>
                )}
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">
                {new Date(s.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400 font-medium">
              No study sessions logged yet. Click "Start Studying" on Home to begin your first session!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
