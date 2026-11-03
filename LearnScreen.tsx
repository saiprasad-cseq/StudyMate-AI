import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Sparkles,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Clock,
  HelpCircle,
  Play,
  Search,
  Filter,
  Check,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Roadmap, RoadmapTopic, RoadmapYear, UserProfile } from '../types';

interface LearnScreenProps {
  roadmap: Roadmap;
  profile: UserProfile;
  onUpdateRoadmap: (updated: Roadmap) => void;
  onStartLesson?: (topic: RoadmapTopic) => void;
  onOpenTutorForTopic: (topic: RoadmapTopic) => void;
  onOpenQuizForTopic: (topic: RoadmapTopic) => void;
  onOpenTimerForTopic: (topic: RoadmapTopic) => void;
}

export const LearnScreen: React.FC<LearnScreenProps> = ({
  roadmap,
  profile,
  onUpdateRoadmap,
  onStartLesson,
  onOpenTutorForTopic,
  onOpenQuizForTopic,
  onOpenTimerForTopic,
}) => {
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({ 'y-1': true });
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({});
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-progress' | 'completed'>('all');

  // Topic Details Drawer/Modal
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);

  // Edit / Add Topic State
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [editTopicDesc, setEditTopicDesc] = useState('');
  const [editTopicHours, setEditTopicHours] = useState(6);

  const toggleYear = (yearId: string) => {
    setExpandedYears((prev) => ({ ...prev, [yearId]: !prev[yearId] }));
  };

  const togglePeriod = (periodId: string) => {
    setExpandedPeriods((prev) => ({ ...prev, [periodId]: !prev[periodId] }));
  };

  const toggleMonth = (monthId: string) => {
    setExpandedMonths((prev) => ({ ...prev, [monthId]: !prev[monthId] }));
  };

  const toggleTopicCompleted = (topicId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    let wasCompleted = false;
    const newRoadmap: Roadmap = {
      ...roadmap,
      years: roadmap.years.map((y) => ({
        ...y,
        periods: y.periods.map((p) => ({
          ...p,
          months: p.months.map((m) => ({
            ...m,
            weeks: m.weeks.map((w) => ({
              ...w,
              topics: w.topics.map((t) => {
                if (t.id === topicId) {
                  wasCompleted = !t.completed;
                  return {
                    ...t,
                    completed: !t.completed,
                    completedAt: !t.completed ? new Date().toISOString() : undefined,
                    masteryLevel: !t.completed ? 100 : 0,
                  };
                }
                return t;
              }),
            })),
          })),
        })),
      })),
      lastUpdated: new Date().toISOString(),
    };

    onUpdateRoadmap(newRoadmap);

    if (wasCompleted) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }

    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic((prev) => (prev ? { ...prev, completed: wasCompleted, masteryLevel: wasCompleted ? 100 : 0 } : null));
    }
  };

  const handleSaveTopicEdit = () => {
    if (!selectedTopic || !editTopicTitle.trim()) return;

    const newRoadmap: Roadmap = {
      ...roadmap,
      years: roadmap.years.map((y) => ({
        ...y,
        periods: y.periods.map((p) => ({
          ...p,
          months: p.months.map((m) => ({
            ...m,
            weeks: m.weeks.map((w) => ({
              ...w,
              topics: w.topics.map((t) => {
                if (t.id === selectedTopic.id) {
                  return {
                    ...t,
                    title: editTopicTitle.trim(),
                    description: editTopicDesc.trim(),
                    estimatedHours: Number(editTopicHours) || 6,
                  };
                }
                return t;
              }),
            })),
          })),
        })),
      })),
      lastUpdated: new Date().toISOString(),
    };

    onUpdateRoadmap(newRoadmap);
    setSelectedTopic((prev) =>
      prev
        ? {
            ...prev,
            title: editTopicTitle.trim(),
            description: editTopicDesc.trim(),
            estimatedHours: Number(editTopicHours) || 6,
          }
        : null
    );
    setIsEditingTopic(false);
  };

  // Flatten topics for statistics
  const allTopics: RoadmapTopic[] = [];
  roadmap.years?.forEach((y) =>
    y.periods?.forEach((p) =>
      p.months?.forEach((m) =>
        m.weeks?.forEach((w) => w.topics?.forEach((top) => allTopics.push(top)))
      )
    )
  );
  const completedTopicsCount = allTopics.filter((t) => t.completed).length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {profile.durationYears}-Year Master Roadmap
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {roadmap.overallGoal || profile.mainGoal}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Structured progression across Years, Semesters, Months, and Weekly milestones.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or concepts..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {(['all', 'in-progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
                  filterStatus === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap Tree Hierarchy */}
      <div className="space-y-4">
        {roadmap.years?.map((year) => {
          const isYearExpanded = expandedYears[year.id] ?? false;

          return (
            <div
              key={year.id}
              className="rounded-3xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition-all"
            >
              {/* Year Accordion Header */}
              <button
                onClick={() => toggleYear(year.id)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                    Y{year.yearNumber}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{year.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{year.goal}</p>
                  </div>
                </div>
                {isYearExpanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Year Children (Semesters/Periods) */}
              {isYearExpanded && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 space-y-4 border-t border-slate-100 pt-4">
                  {year.periods?.map((period) => {
                    const isPeriodExpanded = expandedPeriods[period.id] ?? true;

                    return (
                      <div
                        key={period.id}
                        className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3"
                      >
                        {/* Period Header */}
                        <button
                          onClick={() => togglePeriod(period.id)}
                          className="w-full text-left flex items-center justify-between font-bold text-slate-800 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600" />
                            <span>{period.title}</span>
                          </div>
                          {isPeriodExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        {/* Period Children (Months) */}
                        {isPeriodExpanded && (
                          <div className="space-y-3 pt-1">
                            {period.months?.map((month) => {
                              const isMonthExpanded = expandedMonths[month.id] ?? true;

                              return (
                                <div
                                  key={month.id}
                                  className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3"
                                >
                                  {/* Month Header */}
                                  <button
                                    onClick={() => toggleMonth(month.id)}
                                    className="w-full text-left flex items-center justify-between text-xs font-bold text-slate-700"
                                  >
                                    <span>{month.title}</span>
                                    {isMonthExpanded ? (
                                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                  </button>

                                  {/* Weeks & Topics */}
                                  {isMonthExpanded && (
                                    <div className="space-y-2 pt-1">
                                      {month.weeks?.map((week) => (
                                        <div key={week.id} className="space-y-1.5">
                                          <div className="text-[11px] font-semibold text-slate-400 px-1">
                                            {week.title}
                                          </div>

                                          <div className="grid grid-cols-1 gap-2">
                                            {week.topics?.map((topic) => {
                                              // Search & status filter check
                                              const matchesQuery =
                                                !searchQuery ||
                                                topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                topic.description?.toLowerCase().includes(searchQuery.toLowerCase());
                                              const matchesStatus =
                                                filterStatus === 'all' ||
                                                (filterStatus === 'completed' && topic.completed) ||
                                                (filterStatus === 'in-progress' && !topic.completed);

                                              if (!matchesQuery || !matchesStatus) return null;

                                              return (
                                                <div
                                                  key={topic.id}
                                                  onClick={() => setSelectedTopic(topic)}
                                                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                                    topic.completed
                                                      ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                                                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-2xs text-slate-800'
                                                  }`}
                                                >
                                                  {/* Topic Info */}
                                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <button
                                                      type="button"
                                                      onClick={(e) => toggleTopicCompleted(topic.id, e)}
                                                      className="shrink-0 transition-transform active:scale-90"
                                                    >
                                                      {topic.completed ? (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                                                      ) : (
                                                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                                                      )}
                                                    </button>

                                                    <div className="min-w-0 flex-1">
                                                      <div
                                                        className={`text-sm font-bold truncate ${
                                                          topic.completed ? 'line-through text-slate-400' : 'text-slate-900'
                                                        }`}
                                                      >
                                                        {topic.title}
                                                      </div>
                                                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                                                        <span>~{topic.estimatedHours || 6} hours</span>
                                                        <span>•</span>
                                                        <span className="capitalize">{topic.difficulty}</span>
                                                        {topic.notes?.length > 0 && (
                                                          <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-0.5 text-indigo-600 font-semibold">
                                                              <FileText className="w-3 h-3" />
                                                              {topic.notes.length} note(s)
                                                            </span>
                                                          </>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {/* Right Fast Actions */}
                                                  <div className="flex items-center gap-1">
                                                    <button
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onStartLesson) {
                                                          onStartLesson(topic);
                                                        }
                                                      }}
                                                      className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                                                      title="Open Structured Lesson"
                                                    >
                                                      <BookOpen className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        onOpenTutorForTopic(topic);
                                                      }}
                                                      className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                      title="Ask AI Tutor about this topic"
                                                    >
                                                      <Sparkles className="w-4 h-4" />
                                                    </button>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Topic Details Drawer Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {isEditingTopic ? (
              /* Edit Topic Form */
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Edit Topic</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700">Topic Title</label>
                    <input
                      type="text"
                      value={editTopicTitle}
                      onChange={(e) => setEditTopicTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Description</label>
                    <textarea
                      rows={3}
                      value={editTopicDesc}
                      onChange={(e) => setEditTopicDesc(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Estimated Hours</label>
                    <input
                      type="number"
                      value={editTopicHours}
                      onChange={(e) => setEditTopicHours(Number(e.target.value))}
                      className="w-24 mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsEditingTopic(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTopicEdit}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* Topic Detail View */
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                      {selectedTopic.difficulty} • ~{selectedTopic.estimatedHours || 6} hours
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{selectedTopic.title}</h3>
                  </div>

                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {selectedTopic.description || 'Core theoretical and practical milestones in this topic.'}
                </p>

                {/* Key Concepts */}
                {selectedTopic.keyConcepts?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Key Concepts
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTopic.keyConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Study Notes Attached */}
                {selectedTopic.notes?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Saved Study Notes ({selectedTopic.notes.length})
                    </span>
                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                      {selectedTopic.notes.map((note, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
                        >
                          "{note}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    id="open-structured-lesson-btn"
                    onClick={() => {
                      const t = selectedTopic;
                      setSelectedTopic(null);
                      if (onStartLesson) {
                        onStartLesson(t);
                      }
                    }}
                    className="w-full p-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Open Structured Lesson (Theory + Code + Videos + Practice)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const t = selectedTopic;
                        setSelectedTopic(null);
                        onOpenTutorForTopic(t);
                      }}
                      className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-indigo-100 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>AI Doubt Tutor</span>
                    </button>

                    <button
                      onClick={() => {
                        const t = selectedTopic;
                        setSelectedTopic(null);
                        onOpenQuizForTopic(t);
                      }}
                      className="p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Take Quiz</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditTopicTitle(selectedTopic.title);
                      setEditTopicDesc(selectedTopic.description || '');
                      setEditTopicHours(selectedTopic.estimatedHours || 6);
                      setIsEditingTopic(true);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Topic</span>
                  </button>

                  <button
                    onClick={() => toggleTopicCompleted(selectedTopic.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      selectedTopic.completed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-900 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{selectedTopic.completed ? 'Completed ✓' : 'Mark Completed'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
