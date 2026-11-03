import React from 'react';
import { Flame, Clock, Settings, Sparkles, BookOpen, Palette } from 'lucide-react';
import { UserProfile, AppTheme } from '../types';
import { StreakData } from '../lib/storage';
import { THEMES, THEME_LIST } from '../lib/theme';

interface NavbarProps {
  profile: UserProfile | null;
  streakData: StreakData;
  theme?: AppTheme;
  onOpenSettings: () => void;
  onOpenQuickStudy: () => void;
  onOpenTimer: () => void;
  onSelectTheme?: (theme: AppTheme) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  streakData,
  theme = 'clean',
  onOpenSettings,
  onOpenQuickStudy,
  onOpenTimer,
  onSelectTheme,
}) => {
  const currentTheme = THEMES[theme] || THEMES.clean;

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-6 py-2.5 transition-colors duration-200 ${currentTheme.classes.header}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg flex items-center gap-1.5">
              StudyMate
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${currentTheme.classes.accentBadge}`}>
                V1
              </span>
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Consistency Streak */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold"
            title={`Current study streak: ${streakData.currentStreak} day(s)`}
          >
            <Flame className="w-4 h-4 fill-amber-500 animate-pulse" />
            <span>{streakData.currentStreak}d streak</span>
          </div>

          {/* Quick Study Button */}
          <button
            id="quick-study-btn"
            onClick={onOpenQuickStudy}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${currentTheme.classes.accentBadge}`}
            title="I have limited time (15-60 min sprints)"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Limited Time?</span>
          </button>

          {/* Quick Timer shortcut */}
          <button
            id="timer-nav-btn"
            onClick={onOpenTimer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${currentTheme.classes.secondaryBtn}`}
            title="Start Study Timer"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Timer</span>
          </button>

          {/* Quick Theme Switcher Pill */}
          {onSelectTheme && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-500/10 p-1 rounded-full border border-slate-500/20 text-[11px] font-semibold">
              <Palette className="w-3 h-3 ml-1 text-slate-400" />
              {THEME_LIST.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTheme(t.id)}
                  title={`${t.name} (${t.tagline})`}
                  className={`px-2 py-0.5 rounded-full transition-all text-[10px] font-bold ${
                    theme === t.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {t.code}
                </button>
              ))}
            </div>
          )}

          {/* Settings */}
          <button
            id="settings-btn"
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-colors"
            title="Settings & Theme"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
