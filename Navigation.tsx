import React from 'react';
import {
  Home,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Target,
  BarChart2,
  Settings,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { TabType, AppTheme } from '../types';
import { THEMES } from '../lib/theme';

export type { TabType };

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  roadmapGoal?: string;
  completionPercent?: number;
  theme?: AppTheme;
}

export const Sidebar: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  roadmapGoal,
  completionPercent = 0,
  theme = 'clean',
}) => {
  const currentTheme = THEMES[theme] || THEMES.clean;

  // Primary V1 App Sections
  const primaryNavItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home / Dashboard', icon: Home },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'focus', label: 'Focus Mode', icon: Clock },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`hidden md:flex flex-col w-64 border-r min-h-[calc(100vh-57px)] p-3.5 justify-between select-none ${currentTheme.classes.sidebar}`}>
      <div className="space-y-5">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-1.5 pt-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${currentTheme.classes.textMuted}`}>
              V1 Core Sections
            </span>
          </div>

          <nav className="space-y-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'subjects' && activeTab === 'learn');

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all text-left cursor-pointer ${
                    isActive
                      ? currentTheme.classes.sidebarActive
                      : currentTheme.classes.sidebarInactive
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Companion Section */}
        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 space-y-1">
          <div className="px-3 pb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${currentTheme.classes.textMuted}`}>
              AI Companion
            </span>
          </div>

          <button
            id="sidebar-nav-tutor"
            onClick={() => onSelectTab('tutor')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all text-left cursor-pointer ${
              activeTab === 'tutor'
                ? currentTheme.classes.sidebarActive
                : currentTheme.classes.sidebarInactive
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>AI Tutor</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Live
            </span>
          </button>
        </div>

        {/* Roadmap mini status widget */}
        {roadmapGoal && (
          <div className={`p-3.5 rounded-2xl border space-y-2 ${currentTheme.classes.card}`}>
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className={currentTheme.classes.textMuted}>Goal Journey</span>
              <span className="font-bold">{completionPercent}%</span>
            </div>
            <p className={`text-xs font-medium line-clamp-2 leading-relaxed ${currentTheme.classes.textSecondary}`}>
              {roadmapGoal}
            </p>
            <div className="w-full h-1.5 bg-slate-200/40 dark:bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, completionPercent))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer info & Theme Indicator */}
      <div className={`text-xs px-2 py-2 space-y-1 border-t border-slate-200/40 dark:border-slate-800/60 ${currentTheme.classes.textMuted}`}>
        <div className="flex items-center justify-between">
          <span className="font-bold">StudyMate V1</span>
          <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md ${currentTheme.classes.accentBadge}`}>
            {currentTheme.name.split(' ')[0]}
          </span>
        </div>
        <p className="text-[11px] opacity-80">Daily focused learning</p>
      </div>
    </aside>
  );
};

export const BottomNav: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  theme = 'clean',
}) => {
  const currentTheme = THEMES[theme] || THEMES.clean;

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'focus', label: 'Focus', icon: Clock },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-2 pt-1 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-lg ${currentTheme.classes.header}`}>
      <div className="flex items-center overflow-x-auto no-scrollbar gap-1 py-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'subjects' && activeTab === 'learn');

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 min-w-[56px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all touch-manipulation cursor-pointer ${
                isActive
                  ? 'font-bold text-indigo-500 scale-105'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
