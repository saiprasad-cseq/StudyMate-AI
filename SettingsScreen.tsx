import React, { useState } from 'react';
import {
  Palette,
  User,
  Sliders,
  Sparkles,
  AlertTriangle,
  Check,
  RotateCcw,
  Shield,
  Layers,
} from 'lucide-react';
import { UserProfile, StudyLevel, AppTheme } from '../types';
import { THEMES, THEME_LIST } from '../lib/theme';

interface SettingsScreenProps {
  profile: UserProfile | null;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  onSaveProfile: (profile: UserProfile) => void;
  onRebalanceSchedule: () => Promise<string>;
  onResetProgress: () => void;
  onResetRoadmap: () => void;
  onClearAllData: () => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  profile,
  currentTheme,
  onSelectTheme,
  onSaveProfile,
  onRebalanceSchedule,
  onResetProgress,
  onResetRoadmap,
  onClearAllData,
}) => {
  const activeThemeConfig = THEMES[currentTheme] || THEMES.clean;

  // Profile form state
  const [name, setName] = useState(profile?.name || 'Student');
  const [subject, setSubject] = useState(profile?.subject || 'Computer Science');
  const [mainGoal, setMainGoal] = useState(profile?.mainGoal || '');
  const [durationYears, setDurationYears] = useState(profile?.durationYears || 3);
  const [dailyHours, setDailyHours] = useState(profile?.dailyHours || 1.5);
  const [studyDays, setStudyDays] = useState<string[]>(profile?.studyDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [currentLevel, setCurrentLevel] = useState<StudyLevel>(profile?.currentLevel || 'Beginner');

  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceMessage, setRebalanceMessage] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'progress' | 'roadmap' | 'clear_all' | null>(null);

  const toggleDay = (day: string) => {
    if (studyDays.includes(day)) {
      if (studyDays.length > 1) {
        setStudyDays(studyDays.filter((d) => d !== day));
      }
    } else {
      setStudyDays([...studyDays, day]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || 'Student',
      subject: subject.trim() || 'General Studies',
      mainGoal: mainGoal.trim() || profile.mainGoal,
      durationYears: Number(durationYears) || 3,
      dailyHours: Number(dailyHours) || 1.5,
      studyDays,
      currentLevel,
    };
    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRebalance = async () => {
    setIsRebalancing(true);
    setRebalanceMessage(null);
    try {
      const msg = await onRebalanceSchedule();
      setRebalanceMessage(msg);
    } finally {
      setIsRebalancing(false);
    }
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto ${activeThemeConfig.classes.textPrimary}`}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${activeThemeConfig.classes.accentBadge}`}>
            System Preferences
          </span>
          <span className={`text-xs font-medium ${activeThemeConfig.classes.textMuted}`}>
            Theme & Study Profile
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings & Personalization</h1>
        <p className={`text-sm ${activeThemeConfig.classes.textSecondary} mt-1`}>
          Configure your visual aesthetic, study pace, and personal learning commitments.
        </p>
      </div>

      {/* SECTION 1: THEME / STYLE SYSTEM */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold">Theme & Visual Experience</h2>
          </div>
          <span className={`text-xs font-semibold ${activeThemeConfig.classes.textMuted}`}>
            Active: {activeThemeConfig.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {THEME_LIST.map((t) => {
            const isSelected = currentTheme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTheme(t.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-3 cursor-pointer ${
                  activeThemeConfig.classes.card
                } ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 shadow-md'
                    : 'opacity-85 hover:opacity-100 hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-900 dark:text-white">
                        {t.code}
                      </span>
                      <span className="font-bold text-sm">{t.name}</span>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <p className={`text-xs ${activeThemeConfig.classes.textSecondary} mt-1.5 leading-relaxed`}>
                    {t.description}
                  </p>
                </div>

                {/* Color Palette Preview Swatches */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: t.previewColors.bg }}
                      title="Background"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: t.previewColors.card }}
                      title="Card Surface"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: t.previewColors.accent }}
                      title="Accent Color"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: t.previewColors.border }}
                      title="Border Color"
                    />
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${activeThemeConfig.classes.accentBadge}`}>
                    {t.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: PROFILE & STUDY PREFERENCES */}
      <section className={`p-6 sm:p-8 rounded-3xl border ${activeThemeConfig.classes.card} space-y-6`}>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold">Academic Profile & Pacing</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-medium">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Field of Study / Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Primary Learning Goal</label>
            <textarea
              rows={2}
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Target Duration (Years)</label>
              <input
                type="number"
                min="1"
                max="6"
                step="0.5"
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Current Mastery Level</label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value as StudyLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Daily Study Hours */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold">Daily Study Hours</label>
              <span className="font-bold">{dailyHours} hours/day</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Active Study Days */}
          <div>
            <label className="font-semibold block mb-1.5">Active Study Days</label>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = studyDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      isSelected
                        ? activeThemeConfig.classes.primaryBtn
                        : activeThemeConfig.classes.secondaryBtn
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile Updated Successfully
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold ${activeThemeConfig.classes.primaryBtn}`}
            >
              Save Profile Settings
            </button>
          </div>
        </form>
      </section>

      {/* SECTION 3: INTELLIGENT SCHEDULE ADJUSTMENT */}
      <section className={`p-6 sm:p-8 rounded-3xl border ${activeThemeConfig.classes.card} space-y-4`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold">AI Intelligent Schedule Adjustment</h2>
        </div>
        <p className={`text-xs sm:text-sm ${activeThemeConfig.classes.textSecondary} leading-relaxed`}>
          Life happens. If you took unexpected breaks or fell behind, StudyMate will recalculate your upcoming daily study pacing smoothly without piling on guilt or impossible backlogs.
        </p>

        {rebalanceMessage && (
          <div className={`p-4 rounded-xl border text-xs font-semibold ${activeThemeConfig.classes.accentBadge}`}>
            {rebalanceMessage}
          </div>
        )}

        <button
          onClick={handleRebalance}
          disabled={isRebalancing}
          className={`px-6 py-3 rounded-xl text-xs font-bold ${activeThemeConfig.classes.primaryBtn} transition-all disabled:opacity-50`}
        >
          {isRebalancing ? 'Recalibrating Schedule...' : 'Intelligently Adjust My Plan'}
        </button>
      </section>

      {/* SECTION 4: DATA MANAGEMENT & RESETS */}
      <section className={`p-6 sm:p-8 rounded-3xl border border-rose-500/20 space-y-4 ${activeThemeConfig.classes.card}`}>
        <div className="flex items-center gap-2 text-rose-500">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-lg font-bold">Data Management & Reset</h2>
        </div>

        {confirmAction ? (
          <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 space-y-3">
            <h3 className="font-bold text-sm text-rose-500">
              {confirmAction === 'progress' && 'Confirm: Reset Progress Data?'}
              {confirmAction === 'roadmap' && 'Confirm: Regenerate Entire Curriculum?'}
              {confirmAction === 'clear_all' && 'Confirm: Erase All Local Data?'}
            </h3>
            <p className="text-xs opacity-90 leading-relaxed">
              {confirmAction === 'progress' &&
                'This will clear completed tasks, quiz history, and session logs while preserving your profile and curriculum.'}
              {confirmAction === 'roadmap' &&
                'This will re-synthesize your entire curriculum roadmap from scratch.'}
              {confirmAction === 'clear_all' &&
                'This will wipe all data and return StudyMate to the initial setup screen.'}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmAction === 'progress') onResetProgress();
                  if (confirmAction === 'roadmap') onResetRoadmap();
                  if (confirmAction === 'clear_all') onClearAllData();
                  setConfirmAction(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setConfirmAction('progress')}
              className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-500/10 transition-colors"
            >
              Reset Progress
            </button>
            <button
              onClick={() => setConfirmAction('roadmap')}
              className="p-3 rounded-xl border border-amber-500/40 text-amber-500 text-xs font-semibold hover:bg-amber-500/10 transition-colors"
            >
              Regenerate Roadmap
            </button>
            <button
              onClick={() => setConfirmAction('clear_all')}
              className="p-3 rounded-xl border border-rose-500/40 text-rose-500 text-xs font-semibold hover:bg-rose-500/10 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
