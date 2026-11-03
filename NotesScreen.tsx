import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Pin,
  Trash2,
  Tag,
  BookOpen,
  Check,
  Copy,
  FolderOpen,
} from 'lucide-react';
import { StudyNote, UserProfile, AppTheme } from '../types';
import { THEMES } from '../lib/theme';

interface NotesScreenProps {
  notes: StudyNote[];
  profile: UserProfile | null;
  theme?: AppTheme;
  onSaveNotes: (notes: StudyNote[]) => void;
}

export const NotesScreen: React.FC<NotesScreenProps> = ({
  notes,
  profile,
  theme = 'clean',
  onSaveNotes,
}) => {
  const currentTheme = THEMES[theme] || THEMES.clean;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New note form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Foundations, Core Concept');

  // Collect all unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags || [])));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? n.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newNote: StudyNote = {
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ['General'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
      subject: profile?.subject || 'Curriculum',
    };

    onSaveNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const handleTogglePin = (noteId: string) => {
    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, pinned: !n.pinned } : n
    );
    // Sort pinned to top
    updated.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    onSaveNotes(updated);
  };

  const handleDeleteNote = (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    onSaveNotes(updated);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto ${currentTheme.classes.textPrimary}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${currentTheme.classes.accentBadge}`}>
              Study Notes
            </span>
            <span className={`text-xs font-medium ${currentTheme.classes.textMuted}`}>
              Knowledge Repository
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Study Notes & Insights</h1>
          <p className={`text-sm ${currentTheme.classes.textSecondary} mt-1`}>
            Capture key summaries, mental models, and flash formulas for active revision.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold ${currentTheme.classes.primaryBtn} transition-all self-start sm:self-auto`}
        >
          <Plus className="w-4 h-4" />
          <span>Create Note</span>
        </button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border flex-1 ${currentTheme.classes.card}`}>
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, formulas, or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedTag === null ? currentTheme.classes.primaryBtn : currentTheme.classes.secondaryBtn
            }`}
          >
            All ({notes.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedTag === tag ? currentTheme.classes.primaryBtn : currentTheme.classes.secondaryBtn
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className={`p-10 text-center rounded-3xl border ${currentTheme.classes.card} space-y-3`}>
          <FolderOpen className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="font-bold text-base">No notes found</h3>
          <p className={`text-xs ${currentTheme.classes.textSecondary} max-w-sm mx-auto`}>
            {searchQuery || selectedTag
              ? 'Try adjusting your search query or tag filter.'
              : 'Create your first study note to anchor key concepts and mental models.'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${currentTheme.classes.primaryBtn}`}
          >
            Create New Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative group ${
                currentTheme.classes.card
              } ${note.pinned ? 'ring-2 ring-indigo-500/30' : ''}`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm line-clamp-2 leading-snug">{note.title}</h3>
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    className={`p-1 rounded-md transition-colors ${
                      note.pinned ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title={note.pinned ? 'Unpin note' : 'Pin note to top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className={`text-xs ${currentTheme.classes.textSecondary} whitespace-pre-wrap line-clamp-6 leading-relaxed`}>
                  {note.content}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${currentTheme.classes.accentBadge}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] opacity-70 pt-1">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(note.id, `${note.title}\n\n${note.content}`)}
                      className="hover:text-indigo-400 transition-colors"
                      title="Copy note content"
                    >
                      {copiedId === note.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="hover:text-rose-500 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-lg w-full rounded-2xl border p-6 space-y-4 ${currentTheme.classes.card} shadow-2xl`}>
            <h3 className="text-lg font-bold">New Study Note</h3>
            <form onSubmit={handleCreateNote} className="space-y-3 text-xs font-medium">
              <div>
                <label className="font-semibold block mb-1">Title / Key Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Theorem for Recurrences"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Content & Key Takeaways</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Write formulas, breakdown steps, code notes, or analogies..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Algorithms, Complexity, ExamPrep"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-bold ${currentTheme.classes.primaryBtn}`}
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
