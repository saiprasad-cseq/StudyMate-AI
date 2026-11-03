import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BookOpen, Trash2, HelpCircle, Lightbulb, Code2, ListCheck, BookCheck, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { UserProfile, RoadmapTopic, ChatMessage } from '../types';

interface TutorScreenProps {
  profile: UserProfile | null;
  allTopics: RoadmapTopic[];
  activeTopic: RoadmapTopic | null;
  onSelectTopic: (topic: RoadmapTopic | null) => void;
  messages: ChatMessage[];
  onSendMessage: (content: string, quickAction?: string) => Promise<void>;
  onClearChat: () => void;
  onOpenQuiz: (topic?: RoadmapTopic) => void;
  onBack?: () => void;
}

export const TutorScreen: React.FC<TutorScreenProps> = ({
  profile,
  allTopics,
  activeTopic,
  onSelectTopic,
  messages,
  onSendMessage,
  onClearChat,
  onOpenQuiz,
  onBack,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  useEffect(() => {
    console.log(`[TutorScreen Lifecycle] Component mounted. Active focus topic: "${activeTopic?.title || 'General'}", Message count: ${messages.length}`);
    return () => {
      console.log(`[TutorScreen Lifecycle] Component unmounting.`);
    };
  }, []);

  const handleSend = async (quickAction?: string, customText?: string) => {
    if (isSending) return;
    const textToSend = customText !== undefined ? customText : inputText;
    if (!textToSend.trim() && !quickAction) return;

    setInputText('');
    setIsSending(true);
    try {
      await onSendMessage(textToSend, quickAction);
    } catch (err) {
      console.warn('Handled tutor send issue:', err);
    } finally {
      setIsSending(false);
    }
  };

  const quickActions = [
    { id: 'explain_simply', label: 'Explain simply', icon: Lightbulb, prompt: 'Please explain this concept simply using an intuitive analogy.' },
    { id: 'give_example', label: 'Give an example', icon: Code2, prompt: 'Can you provide a clear, step-by-step example with commentary?' },
    { id: 'practice_questions', label: 'Practice questions', icon: ListCheck, prompt: 'Can you give me 3 practice problems to test my knowledge?' },
    { id: 'summarize', label: 'Summarize key points', icon: BookCheck, prompt: 'Summarize the core takeaways and common pitfalls.' },
    { id: 'explain_mistake', label: 'Explain my mistake', icon: AlertCircle, prompt: 'I am confused by this concept and making mistakes. Can you help explain why?' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] md:h-[calc(100vh-65px)] max-w-4xl mx-auto">
      {/* Top Context & Controls Bar */}
      <div className="p-3 sm:p-4 bg-white border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
        {/* Active Context Selector & Optional Back Button */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          {onBack && (
            <button
              id="tutor-back-btn"
              onClick={onBack}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1 text-xs font-semibold shrink-0 cursor-pointer"
              title="Return to previous screen"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="hidden sm:inline">Focus:</span>
            <select
              id="tutor-focus-select"
              value={activeTopic?.id || ''}
              onChange={(e) => {
                const topic = allTopics.find((t) => t.id === e.target.value) || null;
                onSelectTopic(topic);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 max-w-[220px] sm:max-w-xs truncate cursor-pointer"
            >
              <option value="">General: {profile?.subject || 'All Topics'}</option>
              {allTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <button
            id="tutor-quiz-mode-btn"
            onClick={() => onOpenQuiz(activeTopic || undefined)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors border border-indigo-100 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quiz Mode</span>
          </button>

          {messages.length > 0 && (
            <button
              id="tutor-clear-chat-btn"
              onClick={onClearChat}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Welcome message if empty */}
        {messages.length === 0 && (
          <div className="py-10 text-center max-w-lg mx-auto space-y-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Hi {profile?.name || 'there'}! I'm your AI Study Tutor.
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                I'm here to explain concepts at your level, solve doubts, provide step-by-step examples, and test your understanding patiently.
              </p>
            </div>

            {/* Starter Suggestion Chips */}
            <div className="pt-3 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Try asking:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {[
                  `"Explain ${activeTopic?.title || 'the core foundations of ' + (profile?.subject || 'this course')} simply"`,
                  `"Give me an intuitive real-world analogy"`,
                  `"What are the top 3 mistakes beginners make here?"`,
                  `"Quiz me with 2 quick concept check questions"`,
                ].map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(undefined, promptText.replace(/"/g, ''))}
                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all text-left shadow-2xs hover:border-slate-300"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat History */}
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const isLast = idx === messages.length - 1;
          const isErrorMessage = !isUser && msg.content.includes("temporary connection");

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-semibold text-slate-400">
                <span>{isUser ? profile?.name || 'You' : 'StudyMate Tutor'}</span>
                {msg.topicContext && !isUser && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                    {msg.topicContext}
                  </span>
                )}
              </div>

              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-2xs'
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                ) : !msg.content ? (
                  /* Subtle "StudyMate is thinking..." indicator shown ONLY until first text chunk arrives */
                  <div className="flex items-center gap-2 py-1 text-xs font-semibold text-slate-400">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
                    <span>StudyMate is thinking...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="prose prose-slate prose-sm max-w-none text-slate-800 space-y-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_code]:bg-slate-100 [&_code]:text-slate-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-xs [&_code]:font-mono [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:text-xs [&_strong]:text-slate-900">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    {isErrorMessage && isLast && (
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => {
                            const prevUserMsg = [...messages].reverse().find((m) => m.role === 'user');
                            if (prevUserMsg) {
                              handleSend(prevUserMsg.quickActionType, prevUserMsg.content);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                        >
                          Retry Question
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading fallback indicator only when sending before assistant placeholder is mounted */}
        {isSending && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 py-2">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
            <span>StudyMate is thinking...</span>
          </div>
        )}
      </div>

      {/* Quick Action Chips Bar */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/60 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {quickActions.map((qa) => {
          const Icon = qa.icon;
          return (
            <button
              key={qa.id}
              onClick={() => handleSend(qa.id, qa.prompt)}
              disabled={isSending}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <Icon className="w-3.5 h-3.5 text-indigo-600" />
              <span>{qa.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="tutor-chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeTopic
                ? `Ask about "${activeTopic.title}" or any doubt...`
                : `Ask any question about ${profile?.subject || 'your studies'}...`
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 text-sm font-medium placeholder:text-slate-400 bg-slate-50/50"
          />

          <button
            id="tutor-send-btn"
            type="submit"
            disabled={!inputText.trim() || isSending}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              inputText.trim() && !isSending
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
