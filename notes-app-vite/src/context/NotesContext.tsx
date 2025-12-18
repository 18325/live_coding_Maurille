import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Note, ActiveNote } from '../types';
import { notesAPI } from '../services/api';
import socketService from '../services/socket';
import { debounce } from 'lodash';

interface NotesContextType {
  notes: Note[];
  currentNote: Note | null;
  activeNotes: ActiveNote[];
  selectNote: (note: Note) => void;
  createNote: (title: string) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
  refreshNotes: () => Promise<void>;
}

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  currentNote: null,
  activeNotes: [],
  selectNote: () => {},
  createNote: async () => {},
  updateNote: async () => {},
  deleteNote: async () => {},
  searchNotes: async () => {},
  refreshNotes: async () => {},
});

export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [activeNotes, setActiveNotes] = useState<ActiveNote[]>([]);

  useEffect(() => {
    refreshNotes();

    socketService.onActiveNotes((notes) => {
      setActiveNotes(notes);
    });

    socketService.onNoteUpdate(({ noteId, content, userId }) => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      if (userId === user._id) return;

      setNotes((prev) =>
        prev.map((note) =>
          note._id === noteId ? { ...note, content } : note
        )
      );

      if (currentNote?._id === noteId) {
        setCurrentNote((prev) => (prev ? { ...prev, content } : null));
      }
    });

    return () => {
      socketService.offActiveNotes();
      socketService.offNoteUpdate();
    };
  }, [currentNote]);

  const refreshNotes = async () => {
    try {
      const data = await notesAPI.getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const selectNote = (note: Note) => {
    if (currentNote) {
      socketService.leaveNote(currentNote._id);
    }
    setCurrentNote(note);
    socketService.joinNote(note._id);
  };

  const createNote = async (title: string) => {
    try {
      const note = await notesAPI.createNote(title);
      setNotes((prev) => [note, ...prev]);
      selectNote(note);
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  };

  const debouncedUpdate = debounce(async (id: string, updates: Partial<Note>) => {
    try {
      await notesAPI.updateNote(id, updates);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  }, 500);

  const updateNote = async (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) => (note._id === id ? { ...note, ...updates } : note))
    );

    if (currentNote?._id === id) {
      setCurrentNote((prev) => (prev ? { ...prev, ...updates } : null));
    }

    if (updates.content !== undefined) {
      socketService.updateNote(id, updates.content);
    }

    debouncedUpdate(id, updates);
  };

  const deleteNote = async (id: string) => {
    try {
      await notesAPI.deleteNote(id);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      if (currentNote?._id === id) {
        setCurrentNote(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  };

  const searchNotes = async (query: string) => {
    try {
      if (!query.trim()) {
        await refreshNotes();
        return;
      }
      const data = await notesAPI.searchNotes(query);
      setNotes(data);
    } catch (error) {
      console.error('Failed to search notes:', error);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        currentNote,
        activeNotes,
        selectNote,
        createNote,
        updateNote,
        deleteNote,
        searchNotes,
        refreshNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
