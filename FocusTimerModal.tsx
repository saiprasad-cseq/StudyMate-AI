import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Sparkles, BookOpen, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoadmapTopic, RoadmapTask, StudySession } from '../types';

interface FocusTimerModalProps {
  initialTopic?: RoadmapTopic | null;
  initialTask?: RoadmapTask | null;
  allTopics: RoadmapTopic[];
  onClose: () => void;
  onSessionComplete: (session: StudySession) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  initialTopic,
  initialTask,
  allTopics,
  onClose,
  onSessionComplete,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopic?.id || initialTask?.topicId || allTopics[0]?.id || ''
  );
  const [selectedDurationMins, setSelectedDurationMins] = useState<number>(25);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customInput, setCustomInput] = useState('15');

  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionNote, setReflectionNote] = useState('');

  const timerRef = useRef<any>(null);

  // Set duration preset
  const handleDurationPreset = (mins: number, isCustom = false) => {
    if (isActive) return;
    setIsCustomDuration(isCustom);
    const duration = isCustom ? Number(customInput) || 15 : mins;
    setSelectedDurationMins(duration);
    const secs = duration * 60;
    setTotalSeconds(secs);
    setSecondsRemaining(secs);
    setHasStarted(false);
  };

  useEffect(() => {
    if (isActive && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, secondsRemaining]);

  const toggleTimer = () => {
    if (!hasStarted) setHasStarted(true);
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setHasStarted(false);
    const secs = selectedDurationMins * 60;
    setSecondsRemaining(secs);
  };

  const handleTimerFinish = () => {
    setIsActive(false);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    setShowReflection(true);
  };

  const handleEarlyFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setShowReflection(true);
  };

  const handleSaveReflection = () => {
    const elapsedSeconds = totalSeconds - secondsRemaining;
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    const selectedTopic = allTopics.find((t) => t.id === selectedTopicId) || initialTopic;
    const session: StudySession = {
      id: `session-${Date.now()}`,
      topicId: selectedTopicId,
      topicTitle: selectedTopic?.title || initialTask?.topicTitle || 'Study Session',
      taskId: initialTask?.id,
      durationMinutes: elapsedMinutes,
      timestamp: new Date().toISOString(),
      notes: reflectionNote.trim() || 'Focused study session completed.',
      sessionType: 'focus',
    };

    onSessionComplete(session);
  };

  const progressPercent = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentTopic = allTopics.find((t) => t.id === selectedTopicId) || initialTopic;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {showReflection ? (
          /* Post-session Reflection */
          <div className="space-y-5 pt-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">Session Complete!</h2>
              <p className="text-sm text-slate-500">
                You focused for {Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60))} minute(s).
              </p>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-sm font-semibold text-slate-700">
                What did you learn in this session?
              </label>
              <textarea
                autoFocus
                rows={3}
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                placeholder="e.g. Mastered binary search invariant, practiced two-pointer edge cases, and wrote clean tests..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 text-sm font-medium resize-none placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-400">
                This note will be automatically saved in your topic history for future revision.
              </p>
            </div>

            <button
              onClick={handleSaveReflection}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Save & Update Progress</span>
            </button>
          </div>
        ) : (
          /* Active Focus Timer */
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Focus Mode</span>
              <h2 className="text-xl font-bold text-slate-900">Distraction-Free Study</h2>
            </div>

            {/* Topic selector */}
            {!hasStarted && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Target Topic / Task
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {initialTask && (
                    <option value={initialTask.topicId}>Task: {initialTask.title}</option>
                  )}
                  {allTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.difficulty})
                    </option>
                  ))}
                  {allTopics.length === 0 && <option value="">General Study Session</option>}
                </select>
              </div>
            )}

            {/* Duration Presets */}
            {!hasStarted && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDurationPreset(25, false)}
                    className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      !isCustomDuration && selectedDurationMins === 25
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    25 min
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDurationPreset(50, false)}
                    className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      !isCustomDuration && selectedDurationMins === 50
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    50 min
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDurationPreset(Number(customInput) || 15, true)}
                    className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      isCustomDuration
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {isCustomDuration && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-slate-500">Minutes:</span>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={customInput}
                      onChange={(e) => {
                        setCustomInput(e.target.value);
                        const mins = Number(e.target.value) || 15;
                        setSelectedDurationMins(mins);
                        setTotalSeconds(mins * 60);
                        setSecondsRemaining(mins * 60);
                      }}
                      className="w-20 px-2 py-1 text-sm rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Circular / Countdown Visual Display */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="text-slate-100"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="text-slate-900 transition-all duration-500"
                    strokeWidth="6"
                    strokeDasharray={276}
                    strokeDashoffset={276 - (276 * progressPercent) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
                    {formattedTime}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                    {isActive ? 'In Deep Focus' : hasStarted ? 'Paused' : 'Ready'}
                  </span>
                </div>
              </div>

              {currentTopic && (
                <div className="mt-3 text-center px-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium max-w-[280px] truncate">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{currentTopic.title}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={resetTimer}
                disabled={!hasStarted}
                className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                id="timer-play-pause-btn"
                onClick={toggleTimer}
                className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2.5 shadow-md transition-all ${
                  isActive
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>{hasStarted ? 'Resume' : 'Start Focus'}</span>
                  </>
                )}
              </button>

              {hasStarted && (
                <button
                  onClick={handleEarlyFinish}
                  className="px-4 py-3 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                  title="Finish session and save note"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
