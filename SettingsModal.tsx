import React, { useState } from 'react';
import { X, Sparkles, User, RefreshCw, AlertTriangle, Check, Sliders, Calendar, Palette } from 'lucide-react';
import { UserProfile, StudyLevel, AppTheme } from '../types';
import { THEME_LIST, THEMES } from '../lib/theme';

interface SettingsModalProps {
  profile: UserProfile;
  currentTheme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
  onClose: () => void;
  onSaveProfile: (profile: UserProfile) => void;
  onRebalanceSchedule: () => Promise<string>;
  onResetProgress: () => void;
  onResetRoadmap: () => void;
  onClearAllData: () => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  currentTheme = 'clean',
  onSelectTheme,
  onClose,
  onSaveProfile,
  onRebalanceSchedule,
  onResetProgress,
  onResetRoadmap,
  onClearAllData,
}) => {
  const [name, setName] = useState(profile.name);
  const [subject, setSubject] = useState(profile.subject);
  const [mainGoal, setMainGoal] = useState(profile.mainGoal);
  const [durationYears, setDurationYears] = useState(profile.durationYears);
  const [dailyHours, setDailyHours] = useState(profile.dailyHours);
  const [studyDays, setStudyDays] = useState<string[]>(profile.studyDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [currentLevel, setCurrentLevel] = useState<StudyLevel>(profile.currentLevel);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
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
    setTimeout(() => setSavedSuccess(false), 2000);
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-xl w-full rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Preferences</span>
          <h2 className="text-2xl font-bold text-slate-900">Settings & Profile</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Customize your visual theme, study pacing, target goals, or rebalance your plan.
          </p>
        </div>

        {/* Theme / Style Selector */}
        {onSelectTheme && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>Select Theme Style (5 Selectable Styles)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {THEME_LIST.map((t) => {
                const isSelected = currentTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTheme(t.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 text-slate-800'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold">
                          {t.code}
                        </span>
                        <span className="font-bold text-xs truncate">{t.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{t.tagline}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center -space-x-1">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: t.previewColors.bg }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: t.previewColors.card }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: t.previewColors.accent }} />
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs font-medium">
          {/* Name & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Field of Study</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="font-semibold text-slate-700">Main Long-Term Goal</label>
            <textarea
              rows={2}
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
              className="w-full mt-1 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>

          {/* Duration & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700">Goal Duration (Years)</label>
              <input
                type="number"
                min="1"
                max="6"
                step="0.5"
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold text-sm"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Current Level</label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value as StudyLevel)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold text-sm bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Daily Study Hours */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Daily Study Hours</label>
              <span className="font-bold text-slate-900">{dailyHours} hours/day</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full mt-2 accent-slate-900"
            />
          </div>

          {/* Study Days of Week */}
          <div>
            <label className="font-semibold text-slate-700">Active Study Days</label>
            <div className="grid grid-cols-7 gap-1.5 mt-1.5">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = studyDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Changes Saved
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
            >
              Save Profile Settings
            </button>
          </div>
        </form>

        {/* AI Intelligent Rebalance Plan */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-900 font-bold">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Intelligent Schedule Adjustment</span>
          </div>
          <p className="text-indigo-950 font-medium leading-relaxed">
            Missed a few study days? StudyMate will recalculate upcoming daily milestones smoothly without overwhelming cramming or guilt.
          </p>

          {rebalanceMessage && (
            <div className="p-3 rounded-xl bg-white border border-indigo-200 text-indigo-900 font-semibold leading-relaxed">
              {rebalanceMessage}
            </div>
          )}

          <button
            onClick={handleRebalance}
            disabled={isRebalancing}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isRebalancing ? (
              <span>Re-balancing study rhythm...</span>
            ) : (
              <span>Intelligently Adjust My Plan</span>
            )}
          </button>
        </div>

        {/* Data & Reset Actions */}
        <div className="space-y-3 border-t border-slate-100 pt-4 text-xs">
          <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Data Management & Reset
          </h4>

          {confirmAction ? (
            <div className={`p-4 rounded-2xl border space-y-3 animate-in fade-in zoom-in-95 duration-150 ${
              confirmAction === 'clear_all'
                ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                : confirmAction === 'roadmap'
                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className={`w-4 h-4 shrink-0 ${
                  confirmAction === 'clear_all' ? 'text-rose-600' : confirmAction === 'roadmap' ? 'text-amber-600' : 'text-indigo-600'
                }`} />
                <span>
                  {confirmAction === 'progress' && 'Confirm: Reset Study Progress?'}
                  {confirmAction === 'roadmap' && 'Confirm: Reset & Regenerate Roadmap?'}
                  {confirmAction === 'clear_all' && 'Confirm: Delete All StudyMate Data?'}
                </span>
              </div>

              <p className="text-xs leading-relaxed opacity-90">
                {confirmAction === 'progress' &&
                  'This resets completed topics, study sessions, quizzes, and streak statistics. Your profile information and roadmap topics will be preserved.'}
                {confirmAction === 'roadmap' &&
                  'This will rebuild and regenerate your complete learning roadmap from scratch. Your profile settings and name will be preserved.'}
                {confirmAction === 'clear_all' &&
                  'This will permanently erase all local StudyMate data (profile, roadmap, notes, sessions, streak) and return you to the initial setup screen.'}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirmAction === 'progress') {
                      onResetProgress();
                    } else if (confirmAction === 'roadmap') {
                      onResetRoadmap();
                    } else if (confirmAction === 'clear_all') {
                      onClearAllData();
                    }
                    setConfirmAction(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-white font-bold text-xs transition-colors shadow-xs ${
                    confirmAction === 'clear_all'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : confirmAction === 'roadmap'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {confirmAction === 'progress' && 'Yes, Reset Progress'}
                  {confirmAction === 'roadmap' && 'Yes, Reset Roadmap'}
                  {confirmAction === 'clear_all' && 'Yes, Clear All Data'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                id="settings-reset-progress-btn"
                onClick={() => setConfirmAction('progress')}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-center transition-colors cursor-pointer"
              >
                Reset Progress
              </button>

              <button
                type="button"
                id="settings-reset-roadmap-btn"
                onClick={() => setConfirmAction('roadmap')}
                className="p-2.5 rounded-xl border border-amber-200 hover:bg-amber-50 text-amber-900 font-semibold text-center transition-colors cursor-pointer"
              >
                Reset Roadmap
              </button>

              <button
                type="button"
                id="settings-clear-all-btn"
                onClick={() => setConfirmAction('clear_all')}
                className="p-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold text-center transition-colors cursor-pointer"
              >
                Clear All Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
