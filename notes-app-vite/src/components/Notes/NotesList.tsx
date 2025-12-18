import React, { useState } from 'react';
import { useNotes } from '../../hooks/useNotes';
import NoteItem from './NoteItem';
import TagsFilter from './TagsFilter';

const NotesList: React.FC = () => {
  const { notes, currentNote, createNote, searchNotes, selectNote, activeNotes } = useNotes();
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleCreateNote = async () => {
    if (!title.trim()) return;
    
    try {
      await createNote(title);
      setTitle('');
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleSearch = () => {
    searchNotes(search);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
  };

  // Filter and sort notes
  let filteredNotes = [...notes];

  if (selectedTag) {
    filteredNotes = filteredNotes.filter((note) =>
      note.tags.includes(selectedTag)
    );
  }

  filteredNotes.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'updated':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Your Notes
        </h2>
        
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New note title"
              className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
            <button
              onClick={handleCreateNote}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap shadow-sm"
            >
              Create
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes"
              className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Search
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className="block w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all cursor-pointer"
          >
            <option value="updated">Last Updated</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        
        <TagsFilter onSelectTag={handleTagSelect} selectedTag={selectedTag} />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredNotes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-8">
            No notes found
          </p>
        ) : (
          filteredNotes.map((note) => (
            <NoteItem
              key={note._id}
              note={note}
              active={currentNote?._id === note._id}
              onClick={() => selectNote(note)}
              editors={activeNotes.find((an) => an.noteId === note._id)?.editors || []}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;
