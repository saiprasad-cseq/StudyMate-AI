import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, XCircle, AlertCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, QuizResult, QuizDifficulty, RoadmapTopic, UserProfile } from '../types';

interface QuizModalProps {
  profile: UserProfile | null;
  initialTopic?: RoadmapTopic | null;
  allTopics: RoadmapTopic[];
  onClose: () => void;
  onSaveQuizResult: (result: QuizResult) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  profile,
  initialTopic,
  allTopics,
  onClose,
  onSaveQuizResult,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopic?.id || allTopics[0]?.id || ''
  );
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleStartQuiz = async () => {
    setLoading(true);
    const chosenTopic = allTopics.find((t) => t.id === selectedTopicId) || initialTopic;
    const topicTitle = chosenTopic?.title || profile?.subject || 'Core Concepts';

    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle,
          subject: profile?.subject || 'Computer Science',
          difficulty,
          questionCount,
          keyConcepts: chosenTopic?.keyConcepts || [],
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setQuizFinished(false);
        setQuizResult(null);
      }
    } catch (err) {
      console.error('Quiz loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let score = 0;
    const wrongList: { question: string; chosenOption: string; correctOption: string; explanation: string }[] = [];
    const weakTopicsSet = new Set<string>();

    questions.forEach((q, idx) => {
      const userChoice = selectedAnswers[idx];
      if (userChoice === q.correctAnswer) {
        score += 1;
      } else {
        const chosenText = userChoice !== undefined ? q.options[userChoice] : 'No answer provided';
        const correctText = q.options[q.correctAnswer];
        wrongList.push({
          question: q.question,
          chosenOption: chosenText,
          correctOption: correctText,
          explanation: q.explanation,
        });
        weakTopicsSet.add(q.topic || 'Fundamentals');
      }
    });

    const chosenTopic = allTopics.find((t) => t.id === selectedTopicId) || initialTopic;
    const result: QuizResult = {
      id: `quiz-${Date.now()}`,
      date: new Date().toISOString(),
      topic: chosenTopic?.title || profile?.subject || 'General Quiz',
      score,
      total: questions.length,
      difficulty,
      wrongQuestions: wrongList,
      weakAreas: Array.from(weakTopicsSet),
      aiFeedback:
        score === questions.length
          ? 'Exceptional mastery! You answered all questions correctly.'
          : score >= questions.length * 0.7
          ? 'Great progress! Review the detailed explanations below to cement the few missed concepts.'
          : 'Good effort! These topics are challenging; use the AI Tutor to clarify the explanations below.',
    };

    setQuizResult(result);
    setQuizFinished(true);
    onSaveQuizResult(result);

    if (score >= questions.length * 0.8) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Quiz Config Setup Screen */}
        {questions.length === 0 && !loading && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  AI Quiz Generator
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Test Your Understanding</h2>
              <p className="text-sm text-slate-500">
                Generate an intelligent multiple-choice diagnostic to identify mastery and weak areas.
              </p>
            </div>

            {/* Topic Select */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Topic
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {allTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.difficulty})
                  </option>
                ))}
                {allTopics.length === 0 && (
                  <option value="">{profile?.subject || 'General Subject'}</option>
                )}
              </select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['Easy', 'Medium', 'Hard'] as QuizDifficulty[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-3 rounded-2xl border text-sm font-bold transition-all ${
                      difficulty === d
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Question Count
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[5, 10].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-3 rounded-2xl border text-sm font-bold transition-all ${
                      questionCount === cnt
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Generate Quiz Questions</span>
            </button>
          </div>
        )}

        {/* 2. Loading State */}
        {loading && (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full border-3 border-slate-200 border-t-slate-900 animate-spin" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Crafting Quiz Questions...</h3>
              <p className="text-xs text-slate-500">
                Generating {questionCount} {difficulty.toLowerCase()} questions for your topic.
              </p>
            </div>
          </div>
        )}

        {/* 3. Active Quiz Question View */}
        {!loading && questions.length > 0 && !quizFinished && (
          <div className="space-y-6">
            {/* Question Progress Header */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 pb-3">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {difficulty}
              </span>
            </div>

            {/* Question Stem */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {questions[currentIndex]?.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {questions[currentIndex]?.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D'];
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {optionLetters[optIdx]}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation / Next Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentIndex] === undefined}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  selectedAnswers[currentIndex] !== undefined
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 4. Quiz Result / Review Screen */}
        {!loading && quizFinished && quizResult && (
          <div className="space-y-6">
            {/* Score Banner */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white text-center space-y-2 shadow-lg">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1">
                <Award className="w-7 h-7" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {quizResult.score} / {quizResult.total}
              </div>
              <div className="text-sm text-indigo-200 font-medium">
                {Math.round((quizResult.score / quizResult.total) * 100)}% Mastery Score
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto pt-1">
                {quizResult.aiFeedback}
              </p>
            </div>

            {/* Weak Areas Identified */}
            {quizResult.weakAreas?.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Identified Focus Areas</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quizResult.weakAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white text-amber-900 border border-amber-200 text-xs font-semibold"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Incorrect Answers Breakdown */}
            {quizResult.wrongQuestions.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Detailed Mistake Explanations ({quizResult.wrongQuestions.length})
                </h4>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {quizResult.wrongQuestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
                    >
                      <p className="font-bold text-slate-900 text-sm">{item.question}</p>
                      <div className="flex items-start gap-1.5 text-rose-700 font-medium">
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Your answer:</strong> {item.chosenOption}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Correct answer:</strong> {item.correctOption}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 leading-relaxed">
                        💡 <strong>Explanation:</strong> {item.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold text-center">
                ✨ Flawless performance! No incorrect answers to review.
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setQuestions([]);
                  setQuizFinished(false);
                }}
                className="flex-1 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
