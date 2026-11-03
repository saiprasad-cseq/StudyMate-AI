import { AppTheme } from '../types';

export interface ThemeConfig {
  id: AppTheme;
  code: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  previewColors: {
    bg: string;
    card: string;
    accent: string;
    text: string;
    border: string;
  };
  classes: {
    appBg: string;
    header: string;
    sidebar: string;
    sidebarActive: string;
    sidebarInactive: string;
    card: string;
    cardHover: string;
    primaryBtn: string;
    secondaryBtn: string;
    accentBadge: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    divider: string;
  };
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  clean: {
    id: 'clean',
    code: 'A',
    name: 'Clean & Minimal',
    tagline: 'Distraction-free clarity',
    description: 'Crisp light neutrals, refined typography, subtle borders, and high contrast for maximum focus.',
    badge: 'Minimalist',
    previewColors: {
      bg: '#f8fafc',
      card: '#ffffff',
      accent: '#0f172a',
      text: '#0f172a',
      border: '#e2e8f0',
    },
    classes: {
      appBg: 'bg-slate-50 text-slate-900',
      header: 'bg-white/90 backdrop-blur-md border-slate-200/80 text-slate-900',
      sidebar: 'bg-white border-slate-200/80 text-slate-700',
      sidebarActive: 'bg-slate-900 text-white shadow-xs',
      sidebarInactive: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80',
      card: 'bg-white border-slate-200 text-slate-900 shadow-xs',
      cardHover: 'hover:border-slate-300 hover:shadow-sm',
      primaryBtn: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs',
      secondaryBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60',
      accentBadge: 'bg-slate-100 text-slate-800 border border-slate-200',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-400',
      border: 'border-slate-200',
      divider: 'border-slate-100',
    },
  },
  modern: {
    id: 'modern',
    code: 'B',
    name: 'Modern & Futuristic',
    tagline: 'Cyber tech aesthetic',
    description: 'Deep midnight navy canvas with glowing cyan and electric indigo accents for a cutting-edge vibe.',
    badge: 'Futuristic',
    previewColors: {
      bg: '#090d16',
      card: '#111827',
      accent: '#06b6d4',
      text: '#f8fafc',
      border: '#1e293b',
    },
    classes: {
      appBg: 'bg-[#080d1a] text-slate-100',
      header: 'bg-[#0c1222]/90 backdrop-blur-md border-slate-800 text-slate-100',
      sidebar: 'bg-[#090e1b] border-slate-800/80 text-slate-300',
      sidebarActive: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/40',
      sidebarInactive: 'text-slate-400 hover:text-cyan-200 hover:bg-slate-800/60',
      card: 'bg-[#0f172a] border-slate-800 text-slate-100 shadow-md shadow-black/20',
      cardHover: 'hover:border-cyan-500/40 hover:shadow-cyan-950/20',
      primaryBtn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/25',
      secondaryBtn: 'bg-slate-800/80 hover:bg-slate-800 text-cyan-300 border border-slate-700',
      accentBadge: 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/60',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-500',
      border: 'border-slate-800',
      divider: 'border-slate-800/60',
    },
  },
  calm: {
    id: 'calm',
    code: 'C',
    name: 'Calm & Aesthetic',
    tagline: 'Mindful study atmosphere',
    description: 'Gentle sage green, warm oat canvas, earthy stones, and soft curves for a peaceful, stress-free space.',
    badge: 'Zen Study',
    previewColors: {
      bg: '#f6f5ef',
      card: '#ffffff',
      accent: '#15803d',
      text: '#292524',
      border: '#e7e5dc',
    },
    classes: {
      appBg: 'bg-[#f5f4ed] text-stone-900',
      header: 'bg-[#fcfbf7]/90 backdrop-blur-md border-stone-200 text-stone-900',
      sidebar: 'bg-[#faf9f4] border-stone-200/80 text-stone-700',
      sidebarActive: 'bg-emerald-800 text-white shadow-xs',
      sidebarInactive: 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60',
      card: 'bg-white border-stone-200 text-stone-900 shadow-xs rounded-2xl',
      cardHover: 'hover:border-emerald-200 hover:shadow-sm',
      primaryBtn: 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs',
      secondaryBtn: 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200',
      accentBadge: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-700',
      textMuted: 'text-stone-400',
      border: 'border-stone-200',
      divider: 'border-stone-100',
    },
  },
  gamified: {
    id: 'gamified',
    code: 'D',
    name: 'Gamified',
    tagline: 'Level up your knowledge',
    description: 'Arcade violet universe, glowing amber badges, quest completion styling, and motivational game-like XP indicators.',
    badge: 'Level Up',
    previewColors: {
      bg: '#120d24',
      card: '#1e163b',
      accent: '#f59e0b',
      text: '#faf5ff',
      border: '#382a63',
    },
    classes: {
      appBg: 'bg-[#100b21] text-purple-50',
      header: 'bg-[#171030]/90 backdrop-blur-md border-purple-900/60 text-purple-100',
      sidebar: 'bg-[#140e2b] border-purple-900/50 text-purple-200',
      sidebarActive: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/50',
      sidebarInactive: 'text-purple-300/80 hover:text-amber-300 hover:bg-purple-900/40',
      card: 'bg-[#1c1538] border-purple-900/60 text-purple-50 shadow-md shadow-black/30',
      cardHover: 'hover:border-amber-500/50 hover:shadow-purple-900/30',
      primaryBtn: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-sm shadow-amber-500/30',
      secondaryBtn: 'bg-purple-900/50 hover:bg-purple-900/80 text-amber-300 border border-purple-700/60',
      accentBadge: 'bg-amber-500/15 text-amber-300 border border-amber-500/40',
      textPrimary: 'text-purple-50',
      textSecondary: 'text-purple-200',
      textMuted: 'text-purple-400',
      border: 'border-purple-900/60',
      divider: 'border-purple-900/40',
    },
  },
  hybrid: {
    id: 'hybrid',
    code: 'E',
    name: 'Hybrid — Clean + Modern + Gamification',
    tagline: 'The ultimate synthesis',
    description: 'Clean readable typography + modern dark-indigo surfaces + gamified XP progression and mastery achievements.',
    badge: 'Pro Fusion',
    previewColors: {
      bg: '#0b1120',
      card: '#1e293b',
      accent: '#6366f1',
      text: '#f8fafc',
      border: '#334155',
    },
    classes: {
      appBg: 'bg-[#090d16] text-slate-100',
      header: 'bg-[#0f172a]/90 backdrop-blur-md border-slate-800 text-slate-100',
      sidebar: 'bg-[#0c1222] border-slate-800 text-slate-300',
      sidebarActive: 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm shadow-indigo-950/40',
      sidebarInactive: 'text-slate-400 hover:text-indigo-200 hover:bg-slate-800/60',
      card: 'bg-[#131d33] border-slate-800 text-slate-100 shadow-md',
      cardHover: 'hover:border-indigo-500/40 hover:shadow-indigo-950/20',
      primaryBtn: 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold shadow-sm shadow-indigo-500/25',
      secondaryBtn: 'bg-slate-800/90 hover:bg-slate-750 text-indigo-300 border border-slate-700',
      accentBadge: 'bg-indigo-950/70 text-indigo-300 border border-indigo-700/60',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-500',
      border: 'border-slate-800',
      divider: 'border-slate-800/60',
    },
  },
};

export const THEME_LIST: ThemeConfig[] = Object.values(THEMES);
