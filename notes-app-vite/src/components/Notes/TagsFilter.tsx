import React from 'react';
import { useNotes } from '../../hooks/useNotes';

interface TagsFilterProps {
  onSelectTag: (tag: string | null) => void;
  selectedTag: string | null;
}

const TagsFilter: React.FC<TagsFilterProps> = ({ onSelectTag, selectedTag }) => {
  const { notes } = useNotes();

  // Extract unique tags from all notes
  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags))
  ).sort();

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
        Filter by Tag
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectTag(null)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            selectedTag === null
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedTag === tag
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagsFilter;
