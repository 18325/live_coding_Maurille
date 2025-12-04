import React from 'react';
import { Note, Editor } from '../../types';

interface NoteItemProps {
  note: Note;
  active: boolean;
  onClick: () => void;
  editors: Editor[];
}

const NoteItem: React.FC<NoteItemProps> = ({ note, active, onClick, editors }) => {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div
      className={`p-4 mb-3 rounded-lg cursor-pointer border transition-all ${
        active 
          ? 'border-gray-900 bg-gray-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className={`text-base font-semibold ${
          active ? 'text-gray-900' : 'text-gray-900'
        }`}>
          {note.title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ml-2 ${
          active ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          {formatDate(note.updatedAt)}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {truncateContent(note.content || 'Empty note', 80)}
      </p>
      
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {note.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md border border-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {editors.length > 0 && (
        <div className="flex items-center mt-3 pt-3 border-t border-gray-200">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span className="text-xs font-medium text-green-700">
            {editors.map((editor, index) => (
              <span key={editor.userId}>
                {editor.username}
                {index < editors.length - 1 ? ', ' : ''}
              </span>
            ))}
            {' '}editing
          </span>
        </div>
      )}
    </div>
  );
};

export default NoteItem;
