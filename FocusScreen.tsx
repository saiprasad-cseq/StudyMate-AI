import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  BookOpen,
  Coffee,
  Flame,
  Clock,
} from 'lucide-react';
import { RoadmapTopic, RoadmapTask, UserProfile, StudySession, AppTheme } from '../types';
import { THEMES } from '../lib/theme';

interface FocusScreenProps {
  profile: UserProfile | null;
  allTopics: RoadmapTopic[];
  tasks: RoadmapTask[];
  theme?: AppTheme;
  onSessionComplete: (session: StudySession) => void;
}

const PRESETS = [
  { label: 'Pomodoro', minutes: 25 },
  { label: 'Deep Work', minutes: 45 },
  { label: 'Extended', minutes: 60 },
  { label: 'Quick Sprint', minutes: 15 },
];

export const FocusScreen: React.FC<FocusScreenProps> = ({
  profile,
  allTopics,
  tasks,
  theme = 'clean',
  onSessionComplete,
}) => {
  const currentTheme = THEMES[theme] || THEMES.clean;
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(allTopics[0]?.title || 'Deep Work Focus');
  const [sessionNotes, setSessionNotes] = useState('');
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handleSelectPreset = (mins: number) => {
    setIsActive(false);
    setSelectedMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsRemaining(selectedMinutes * 60);
  };

  const handleComplete = () => {
    setIsActive(false);
    const timeSpent = selectedMinutes;
    const newSession: StudySession = {
      id: `focus-${Date.now()}`,
      topicTitle: selectedTopic,
      durationMinutes: timeSpent,
      timestamp: new Date().toISOString(),
      notes: sessionNotes.trim() || 'Focused study sprint completed in V1 Focus Mode.',
      sessionType: 'focus',
    };
    onSessionComplete(newSession);
    setCompletedSessionsCount((c) => c + 1);
    setSecondsRemaining(selectedMinutes * 60);
    setSessionNotes('');
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const totalSeconds = selectedMinutes * 60;
  const progressPercent = Math.min(100, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100));

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto ${currentTheme.classes.textPrimary}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${currentTheme.classes.accentBadge}`}>
              Focus Mode
            </span>
            <span className={`text-xs font-medium ${currentTheme.classes.textMuted}`}>
              Flow State Environment
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Focus Chamber</h1>
          <p className={`text-sm ${currentTheme.classes.textSecondary} mt-1`}>
            Eliminate distractions and build deep immersion with structured intervals.
          </p>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${currentTheme.classes.accentBadge} text-xs font-semibold`}>
          <Flame className="w-4 h-4 text-amber-500" />
          <span>{completedSessionsCount} sessions completed today</span>
        </div>
      </div>

      {/* Main Focus Stage */}
      <div className={`p-6 sm:p-10 rounded-3xl border ${currentTheme.classes.card} text-center space-y-8 relative overflow-hidden shadow-xl`}>
        {/* Topic Selector */}
        <div className="max-w-md mx-auto space-y-2">
          <label className={`text-xs font-bold uppercase tracking-wider ${currentTheme.classes.textMuted}`}>
            Anchor Topic / Subject
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            disabled={isActive}
            className={`w-full py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all focus:outline-none ${
              theme === 'clean' || theme === 'calm'
                ? 'bg-slate-50 border-slate-200 text-slate-900'
                : 'bg-slate-900/80 border-slate-700 text-slate-100'
            }`}
          >
            {allTopics.map((t) => (
              <option key={t.id} value={t.title}>
                {t.title}
              </option>
            ))}
            {allTopics.length === 0 && (
              <option value={profile?.subject || 'Core Curriculum'}>
                {profile?.subject || 'Core Curriculum'}
              </option>
            )}
          </select>
        </div>

        {/* Circular Countdown Display */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="opacity-15"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className={`transition-all duration-1000 ${
                theme === 'gamified'
                  ? 'text-amber-500'
                  : theme === 'modern'
                  ? 'text-cyan-400'
                  : theme === 'calm'
                  ? 'text-emerald-600'
                  : 'text-indigo-600'
              }`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-extrabold tracking-tighter tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className={`text-xs font-semibold tracking-wider uppercase mt-2 ${currentTheme.classes.textMuted}`}>
              {isActive ? 'Session Active' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap justify-center gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleSelectPreset(preset.minutes)}
              disabled={isActive}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                selectedMinutes === preset.minutes
                  ? currentTheme.classes.primaryBtn
                  : currentTheme.classes.secondaryBtn
              }`}
            >
              {preset.label} ({preset.minutes}m)
            </button>
          ))}
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className={`p-3 rounded-2xl border ${currentTheme.classes.secondaryBtn} transition-all`}
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all ${
              currentTheme.classes.primaryBtn
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Begin Focus</span>
              </>
            )}
          </button>

          <button
            onClick={handleComplete}
            className={`p-3 rounded-2xl border text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 transition-all`}
            title="Mark Session Done Early"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>

        {/* Session Quick Scratchpad */}
        <div className="max-w-md mx-auto pt-4 text-left">
          <label className={`text-xs font-semibold block mb-1.5 ${currentTheme.classes.textSecondary}`}>
            Session Key Takeaways / Scratchpad
          </label>
          <input
            type="text"
            placeholder="Quick formula, concept, or insight learned during this sprint..."
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            className={`w-full px-3.5 py-2 rounded-xl text-xs border transition-all focus:outline-none ${
              theme === 'clean' || theme === 'calm'
                ? 'bg-slate-50 border-slate-200 text-slate-900'
                : 'bg-slate-900/80 border-slate-700 text-slate-100'
            }`}
          />
        </div>
      </div>

      {/* Focus Strategy Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-4 rounded-2xl border ${currentTheme.classes.card} space-y-1.5`}>
          <div className="flex items-center gap-2 font-bold text-xs">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Single-Tasking</span>
          </div>
          <p className={`text-xs ${currentTheme.classes.textSecondary} leading-relaxed`}>
            Keep only one study resource open at a time to prevent cognitive switching fatigue.
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${currentTheme.classes.card} space-y-1.5`}>
          <div className="flex items-center gap-2 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Active Recall</span>
          </div>
          <p className={`text-xs ${currentTheme.classes.textSecondary} leading-relaxed`}>
            Close notes every 15 minutes and explain the key theorem or code logic aloud.
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${currentTheme.classes.card} space-y-1.5`}>
          <div className="flex items-center gap-2 font-bold text-xs">
            <Coffee className="w-4 h-4 text-emerald-400" />
            <span>Intentional Rest</span>
          </div>
          <p className={`text-xs ${currentTheme.classes.textSecondary} leading-relaxed`}>
            Step away from screens between study intervals to allow consolidation in memory.
          </p>
        </div>
      </div>
    </div>
  );
};
