import React, { useState, useEffect } from 'react';
import { useNotes } from '../../hooks/useNotes';
import { marked } from 'marked';

const NoteEditor: React.FC = () => {
  const { currentNote, updateNote, deleteNote, activeNotes } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content || '');
      setTags(currentNote.tags);
    }
  }, [currentNote]);

  useEffect(() => {
    if (currentNote && (title !== currentNote.title || content !== currentNote.content || JSON.stringify(tags) !== JSON.stringify(currentNote.tags))) {
      const timer = setTimeout(() => {
        updateNote(currentNote._id, { title, content, tags });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [title, content, tags, currentNote]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDelete = async () => {
    if (currentNote && window.confirm('Delete this note?')) {
      await deleteNote(currentNote._id);
    }
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const exportNote = (format: 'md' | 'txt') => {
    if (!currentNote) return;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  if (!currentNote) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500">Select a note to start editing</p>
      </div>
    );
  }

  const currentEditors = activeNotes.find(an => an.noteId === currentNote._id)?.editors || [];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold text-gray-900 border-none focus:outline-none bg-transparent"
          placeholder="Note title"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => insertMarkdown('**', '**')}
            className="px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => insertMarkdown('*', '*')}
            className="px-3 py-1.5 text-sm italic text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Italic"
          >
            I
          </button>
          <button
            onClick={() => insertMarkdown('# ', '')}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Heading"
          >
            H
          </button>
          <button
            onClick={() => insertMarkdown('- ', '')}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="List"
          >
            List
          </button>
          <button
            onClick={() => insertMarkdown('`', '`')}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Code"
          >
            Code
          </button>
          <button
            onClick={() => insertMarkdown('> ', '')}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Quote"
          >
            Quote
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
              showMarkdownPreview
                ? 'text-white bg-gray-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {showMarkdownPreview ? 'Edit' : 'Preview'}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => exportNote('md')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Markdown (.md)
                </button>
                <button
                  onClick={() => exportNote('txt')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Text (.txt)
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleDelete}
            className="px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="flex-1 overflow-hidden">
        {showMarkdownPreview ? (
          <div
            className="h-full overflow-y-auto px-6 py-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(content) as string }}
          />
        ) : (
          <div className="h-full px-6 py-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-0 border-0 resize-none focus:outline-none text-base leading-relaxed bg-transparent"
              placeholder="Start writing..."
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Tags</label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="Add tag"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Add
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-gray-500 hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {currentEditors.length > 0 && (
          <div className="flex items-center px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            <span className="text-sm font-semibold text-green-700">
              {currentEditors.map(e => e.username).join(', ')} currently editing
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
