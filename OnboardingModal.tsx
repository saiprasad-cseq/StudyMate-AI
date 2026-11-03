import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Compass, BookOpen, Clock, Calendar } from 'lucide-react';
import { UserProfile, StudyLevel, Roadmap } from '../types';

interface OnboardingModalProps {
  onComplete: (profile: UserProfile, roadmap: Roadmap) => void;
}

const POPULAR_SUBJECTS = [
  'Computer Science & Engineering',
  'Data Science & AI',
  'Medicine & USMLE',
  'Software Development',
  'Electrical Engineering',
  'Law & Jurisprudence',
  'Business Administration & Finance',
  'Mathematics & Statistics'
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [currentLevel, setCurrentLevel] = useState<StudyLevel>('Beginner');
  const [mainGoal, setMainGoal] = useState('');
  const [durationYears, setDurationYears] = useState<number>(3);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customYearsInput, setCustomYearsInput] = useState('3');
  
  // Default target date: 3 years from today
  const defaultTarget = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [targetDate, setTargetDate] = useState(defaultTarget);
  
  const [dailyHours, setDailyHours] = useState<number>(1.5);
  const [studyDays, setStudyDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

  const toggleDay = (day: string) => {
    if (studyDays.includes(day)) {
      if (studyDays.length > 1) {
        setStudyDays(studyDays.filter((d) => d !== day));
      }
    } else {
      setStudyDays([...studyDays, day]);
    }
  };

  const handleNext = () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleDurationSelect = (years: number, custom = false) => {
    setIsCustomDuration(custom);
    if (!custom) {
      setDurationYears(years);
      // Auto update target date based on selected duration
      const future = new Date(Date.now() + years * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setTargetDate(future);
    }
  };

  const handleSubmit = async () => {
    const finalYears = isCustomDuration ? Math.max(1, Number(customYearsInput) || 3) : durationYears;
    const finalProfile: UserProfile = {
      name: name.trim() || 'Student',
      subject: subject.trim() || 'Computer Science & AI',
      currentLevel,
      mainGoal: mainGoal.trim() || `Master ${subject || 'my field'} comprehensively`,
      durationYears: finalYears,
      targetDate: targetDate || defaultTarget,
      dailyHours: Number(dailyHours) || 1.5,
      studyDays: studyDays.length > 0 ? studyDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      createdAt: new Date().toISOString(),
      onboardingCompleted: true,
    };

    setIsGenerating(true);

    // Generation phase visual animation steps
    const phases = [
      'Analyzing your long-term goal & academic profile...',
      'Structuring multi-year progression & semester milestones...',
      'Calibrating daily study pacing & weekly topics...',
      'Finalizing your personalized StudyMate roadmap...'
    ];

    const timer = setInterval(() => {
      setGenerationPhase((prev) => {
        if (prev < phases.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      const response = await fetch('/api/ai/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProfile),
      });

      const data = await response.json();
      clearInterval(timer);
      if (data.roadmap) {
        onComplete(finalProfile, data.roadmap);
      } else {
        throw new Error('No roadmap returned');
      }
    } catch (err) {
      clearInterval(timer);
      console.error('Error generating roadmap, constructing local fallback', err);
      // Construct fallback roadmap
      const fallbackRoadmap: Roadmap = {
        id: `roadmap-${Date.now()}`,
        overallGoal: finalProfile.mainGoal,
        subject: finalProfile.subject,
        years: [
          {
            id: 'y-1',
            yearNumber: 1,
            title: 'Year 1: Foundations & Core Principles',
            goal: `Establish deep mastery of ${finalProfile.subject} basics.`,
            periods: [
              {
                id: 'p-1',
                periodNumber: 1,
                title: 'Semester 1: Core Fundamentals',
                theme: 'Foundational Knowledge',
                months: [
                  {
                    id: 'm-1',
                    monthNumber: 1,
                    title: 'Month 1: Getting Started & Essential Tools',
                    summary: 'Orientation, syntax primitives, and baseline problem solving.',
                    weeks: [
                      {
                        id: 'w-1',
                        weekNumber: 1,
                        title: 'Week 1: Fundamentals Deep Dive',
                        summary: 'Master foundational syntax and execution flow.',
                        topics: [
                          {
                            id: 'top-1',
                            title: `${finalProfile.subject} Basics & Logic`,
                            description: 'Core concepts and structured problem-solving approach.',
                            estimatedHours: 6,
                            difficulty: finalProfile.currentLevel,
                            keyConcepts: ['Syntax & Primitives', 'Control Flow', 'Modular Functions'],
                            completed: false,
                            masteryLevel: 0,
                            notes: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        aiRecommendation: `Welcome ${finalProfile.name}! Your study journey is ready. Let's begin with Year 1 fundamentals.`,
        lastUpdated: new Date().toISOString()
      };
      onComplete(finalProfile, fallbackRoadmap);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return subject.trim().length > 0;
      case 3: return Boolean(currentLevel);
      case 4: return mainGoal.trim().length > 0;
      case 5: return isCustomDuration ? Number(customYearsInput) > 0 : durationYears > 0;
      case 6: return Boolean(targetDate);
      case 7: return dailyHours > 0;
      case 8: return studyDays.length > 0;
      default: return true;
    }
  };

  if (isGenerating) {
    const phases = [
      'Analyzing your long-term goal & academic profile...',
      'Structuring multi-year progression & semester milestones...',
      'Calibrating daily study pacing & weekly topics...',
      'Finalizing your personalized StudyMate roadmap...'
    ];

    return (
      <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin" />
            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Crafting Your Study Roadmap</h2>
            <p className="text-sm text-slate-500 font-medium min-h-[40px] transition-all">
              {phases[generationPhase]}
            </p>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-700"
              style={{ width: `${((generationPhase + 1) / phases.length) * 100}%` }}
            />
          </div>

          <p className="text-xs text-slate-400">
            StudyMate is tailoring a multi-year curriculum to your exact schedule.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-xl w-full rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Step {step} of 8</span>
            <span>{Math.round((step / 8) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[260px] flex flex-col justify-center">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Welcome to StudyMate</span>
                <h2 className="text-2xl font-bold text-slate-900">What is your name?</h2>
                <p className="text-sm text-slate-500">We will personalize your daily study greeting and guidance.</p>
              </div>
              <input
                id="onboarding-name-input"
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sai, Alex, Maya..."
                onKeyDown={(e) => e.key === 'Enter' && isStepValid() && handleNext()}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium text-lg placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Step 2: Subject */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Field of Study</span>
                <h2 className="text-2xl font-bold text-slate-900">What are you studying?</h2>
                <p className="text-sm text-slate-500">Choose a major field or type your custom discipline.</p>
              </div>
              <input
                id="onboarding-subject-input"
                type="text"
                autoFocus
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Computer Science, Medicine, Law..."
                onKeyDown={(e) => e.key === 'Enter' && isStepValid() && handleNext()}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {POPULAR_SUBJECTS.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubject(sub)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors border ${
                      subject === sub
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Current Level */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Starting Point</span>
                <h2 className="text-2xl font-bold text-slate-900">What is your current level?</h2>
                <p className="text-sm text-slate-500">This helps the AI tutor adapt explanation depth.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { level: 'Beginner' as StudyLevel, label: 'Beginner', desc: 'Starting from scratch or early fundamentals.' },
                  { level: 'Intermediate' as StudyLevel, label: 'Intermediate', desc: 'Familiar with core concepts, building depth.' },
                  { level: 'Advanced' as StudyLevel, label: 'Advanced', desc: 'Solid foundation, aiming for expert mastery.' }
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setCurrentLevel(item.level)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      currentLevel === item.level
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-base">{item.label}</div>
                    <div className={`text-xs mt-1 ${currentLevel === item.level ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Main Goal */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">North Star</span>
                <h2 className="text-2xl font-bold text-slate-900">What is your main goal?</h2>
                <p className="text-sm text-slate-500">Be specific about what success looks like for you.</p>
              </div>
              <textarea
                id="onboarding-goal-input"
                autoFocus
                rows={3}
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
                placeholder="e.g. Master Data Structures & Algorithms, crack top tech interviews, and build production-grade full stack applications."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium resize-none placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Step 5: Study Duration */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Timeline</span>
                <h2 className="text-2xl font-bold text-slate-900">How long do you want to study?</h2>
                <p className="text-sm text-slate-500">Multi-year roadmaps build durable, lasting competence.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleDurationSelect(3, false)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    !isCustomDuration && durationYears === 3
                      ? 'border-slate-900 bg-slate-900 text-white font-bold'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="text-lg">3 Years</div>
                  <div className={`text-xs mt-0.5 ${!isCustomDuration && durationYears === 3 ? 'text-slate-300' : 'text-slate-500'}`}>Standard</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDurationSelect(4, false)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    !isCustomDuration && durationYears === 4
                      ? 'border-slate-900 bg-slate-900 text-white font-bold'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="text-lg">4 Years</div>
                  <div className={`text-xs mt-0.5 ${!isCustomDuration && durationYears === 4 ? 'text-slate-300' : 'text-slate-500'}`}>Degree/Deep</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDurationSelect(durationYears, true)}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    isCustomDuration
                      ? 'border-slate-900 bg-slate-900 text-white font-bold'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="text-lg">Custom</div>
                  <div className={`text-xs mt-0.5 ${isCustomDuration ? 'text-slate-300' : 'text-slate-500'}`}>Flexible</div>
                </button>
              </div>

              {isCustomDuration && (
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-sm font-medium text-slate-600">Custom Years:</span>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    step="1"
                    value={customYearsInput}
                    onChange={(e) => setCustomYearsInput(e.target.value)}
                    className="w-24 px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold"
                  />
                  <span className="text-sm text-slate-500">years</span>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Target Date */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Goal Target</span>
                <h2 className="text-2xl font-bold text-slate-900">What is your target date?</h2>
                <p className="text-sm text-slate-500">Estimated completion milestone for your ultimate goal.</p>
              </div>
              <div className="relative">
                <input
                  id="onboarding-date-input"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-semibold text-lg"
                />
              </div>
            </div>
          )}

          {/* Step 7: Daily Hours */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Daily Pacing</span>
                <h2 className="text-2xl font-bold text-slate-900">How many hours can you study per day?</h2>
                <p className="text-sm text-slate-500">Realistic daily consistency beats overwhelming cramming.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[1, 1.5, 2, 3].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDailyHours(hrs)}
                    className={`py-3.5 px-3 rounded-2xl border text-center transition-all ${
                      dailyHours === hrs
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    {hrs} {hrs === 1 ? 'hour' : 'hours'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-medium text-slate-500">Custom hours:</span>
                <input
                  type="range"
                  min="0.5"
                  max="6"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="flex-1 accent-slate-900"
                />
                <span className="text-sm font-bold text-slate-900 w-16 text-right">{dailyHours}h / day</span>
              </div>
            </div>
          )}

          {/* Step 8: Days of the Week */}
          {step === 8 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Weekly Rhythm</span>
                <h2 className="text-2xl font-bold text-slate-900">Which days do you want to study?</h2>
                <p className="text-sm text-slate-500">Select the active days that match your regular routine.</p>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = studyDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`py-3 rounded-2xl border text-center text-sm font-semibold transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 text-center">
                {studyDays.length} days selected • Total ~{Math.round(studyDays.length * dailyHours * 10) / 10} hours per week
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {step > 1 ? (
            <button
              id="onboarding-back-btn"
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            id="onboarding-next-btn"
            type="button"
            disabled={!isStepValid()}
            onClick={handleNext}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
              isStepValid()
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{step === 8 ? 'Generate My Roadmap' : 'Continue'}</span>
            {step === 8 ? <Sparkles className="w-4 h-4 text-indigo-300" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
