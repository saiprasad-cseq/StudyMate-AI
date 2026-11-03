import React, { useState } from 'react';
import { X, Sparkles, Clock, CheckCircle2, ChevronDown, ChevronUp, Play, BookOpen } from 'lucide-react';
import { UserProfile, RoadmapTopic, QuickStudySession } from '../types';

interface QuickStudyModalProps {
  profile: UserProfile | null;
  currentTopic?: RoadmapTopic | null;
  onClose: () => void;
  onStartTimerWithTopic: (topic: RoadmapTopic, durationMins: number) => void;
}

export const QuickStudyModal: React.FC<QuickStudyModalProps> = ({
  profile,
  currentTopic,
  onClose,
  onStartTimerWithTopic,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState<QuickStudySession | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const generateQuickStudy = async (mins: number) => {
    setSelectedDuration(mins);
    setLoading(true);
    setRevealedAnswers({});
    try {
      const response = await fetch('/api/ai/quick-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationMinutes: mins,
          topicTitle: currentTopic?.title || profile?.subject || 'Core Concepts',
          subject: profile?.subject || 'Computer Science',
          currentLevel: profile?.currentLevel || 'Beginner',
        }),
      });

      const data = await response.json();
      if (data.session) {
        setSessionData(data.session);
      }
    } catch (err) {
      console.error('Quick study generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (idx: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
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
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Limited Time Mode
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">High-Yield Study Sprint</h2>
          <p className="text-sm text-slate-500">
            Have limited time today? StudyMate will distill the highest-impact learning for your available window.
          </p>
        </div>

        {/* Duration Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Select Your Available Time
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => generateQuickStudy(mins)}
                disabled={loading}
                className={`py-3 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer ${
                  selectedDuration === mins && (sessionData || loading)
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-base">{mins}m</div>
                <div className="text-[10px] font-normal opacity-80">Sprint</div>
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                const customMins = Number(prompt('Enter available study minutes (5 - 180):', '25')) || 25;
                if (customMins > 0) generateQuickStudy(customMins);
              }}
              disabled={loading}
              className="py-3 rounded-2xl border border-dashed border-slate-300 text-center font-bold text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="text-sm">Custom</div>
              <div className="text-[10px] font-normal opacity-70">Minutes</div>
            </button>
          </div>
        </div>

        {/* Topic reminder */}
        {currentTopic && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
            <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Targeting Topic: </span>
            <strong className="text-slate-800 truncate">{currentTopic.title}</strong>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full border-3 border-slate-200 border-t-slate-900 animate-spin" />
            <p className="text-sm text-slate-600 font-medium">
              Generating your {selectedDuration}-minute high-yield breakdown...
            </p>
          </div>
        )}

        {/* Generated Session Content */}
        {!loading && sessionData && (
          <div className="space-y-5 border-t border-slate-100 pt-5 animate-in fade-in duration-300">
            {/* High Yield Summary */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                ⚡ Core Distillation
              </span>
              <p className="text-sm text-indigo-950 leading-relaxed font-medium">
                {sessionData.highYieldSummary}
              </p>
            </div>

            {/* Core Concepts */}
            {sessionData.coreConcepts?.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Key Takeaway Pillars
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sessionData.coreConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800"
                    >
                      • {concept}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rapid Check Questions */}
            {sessionData.rapidCheckQuestions?.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Rapid Retention Check (Click to verify)
                </span>
                <div className="space-y-2">
                  {sessionData.rapidCheckQuestions.map((q, idx) => {
                    const isRevealed = revealedAnswers[idx];
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleAnswer(idx)}
                          className="w-full p-3.5 text-left flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-50"
                        >
                          <span>{q.question}</span>
                          {isRevealed ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>
                        {isRevealed && (
                          <div className="px-3.5 pb-3.5 text-xs text-slate-600 font-medium bg-slate-50/50 border-t border-slate-100">
                            💡 <strong className="text-slate-800">Answer:</strong> {q.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Item */}
            {sessionData.actionItem && (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Sprint Drill:</strong> {sessionData.actionItem}
                </div>
              </div>
            )}

            {/* Action button to launch timer with this duration */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (currentTopic) {
                    onStartTimerWithTopic(currentTopic, sessionData.durationMinutes);
                  } else {
                    onClose();
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start {sessionData.durationMinutes}-Minute Timer Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Default prompt before selecting */}
        {!loading && !sessionData && (
          <div className="py-6 text-center">
            <button
              onClick={() => generateQuickStudy(15)}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Generate 15-Minute Sprint</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
