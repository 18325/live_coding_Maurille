import { Request, Response } from 'express';
import Note, { INote } from '../models/Note';
import mongoose from 'mongoose';

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, tags, userId } = req.body;
    
    if (!title || !userId) {
      return res.status(400).json({ message: 'Title and userId are required' });
    }
    
    const note = await Note.create({
      title,
      content: content || '',
      tags: tags || [],
      creator: userId,
      editors: [userId]
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const { userId, tag, search, sort } = req.query;
    
    let query: any = {};
    // Filter by user
    if (userId) {
        query.$or = [
          { creator: userId },
          { editors: userId }
        ];
      }
      
      // Filter by tag
      if (tag) {
        query.tags = tag;
      }
      
      // Search by title or content
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ];
      }
      let sortOption = {};
    
    // Sort options
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'updated') {
      sortOption = { updatedAt: -1 };
    } else {
      sortOption = { updatedAt: -1 }; // Default sort
    }
    
    const notes = await Note.find(query)
      .sort(sortOption)
      .populate('creator', 'username')
      .populate('editors', 'username');
    
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
export const getNoteById = async (req: Request, res: Response) => {
    try {
      const noteId = req.params.id;
      
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({ message: 'Invalid note ID' });
      }
      
      const note = await Note.findById(noteId)
        .populate('creator', 'username')
        .populate('editors', 'username');
      
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  export const updateNote = async (req: Request, res: Response) => {
    try {
      const noteId = req.params.id;
      const { title, content, tags, userId } = req.body;
      
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({ message: 'Invalid note ID' });
      }
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const note = await Note.findById(noteId);
      
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      // Add user to editors if not already there
    if (!note.editors.includes(userId as any)) {
        note.editors.push(userId as any);
      }
      
      note.title = title || note.title;
      note.content = content !== undefined ? content : note.content;
      note.tags = tags || note.tags;
      note.updatedAt = new Date();
      
      await note.save();
      
      const updatedNote = await Note.findById(noteId)
        .populate('creator', 'username')
        .populate('editors', 'username');
      
      res.status(200).json(updatedNote);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  export const deleteNote = async (req: Request, res: Response) => {
    try {
      const noteId = req.params.id;
      const { userId } = req.body;
      
      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({ message: 'Invalid note ID' });
      }
      
      const note = await Note.findById(noteId);
      
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      // Check if user is the creator
      if (note.creator.toString() !== userId) {
        return res.status(403).json({ message: 'Only the creator can delete this note' });
      }
      await Note.findByIdAndDelete(noteId);
    
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};