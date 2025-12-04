import { Server, Socket } from 'socket.io';
import Note from '../models/Note';

interface User {
  userId: string;
  username: string;
  socketId: string;
}

interface NoteEdit {
  noteId: string;
  userId: string;
  content: string;
  cursorPosition?: number;
}

// Store active users
const activeUsers: User[] = [];
// Store which notes are being edited and by whom
const activeNotes: Map<string, Set<string>> = new Map();

export const setupNoteSocketHandlers = (io: Server) => {
  
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);
    
    // User joins with their info
    socket.on('user_join', (user: { userId: string; username: string }) => {
      const newUser: User = {
        userId: user.userId,
        username: user.username,
        socketId: socket.id
      };
      
      // Add to active users
      activeUsers.push(newUser);
      // Broadcast updated user list
      io.emit('active_users', activeUsers);
      
      console.log(`${user.username} joined. Active users: ${activeUsers.length}`);
    });
    
    // User starts editing a note
    socket.on('start_editing', ({ noteId, userId }: { noteId: string, userId: string }) => {
      // Join the note's room
      socket.join(`note-${noteId}`);
      
      // Add user to the set of editors for this note
      if (!activeNotes.has(noteId)) {
        activeNotes.set(noteId, new Set());
      }
      activeNotes.get(noteId)?.add(userId);
      
      // Notify all clients about who's editing this note
      const editors = Array.from(activeNotes.get(noteId) || []).map(editorId => {
        const editor = activeUsers.find(user => user.userId === editorId);
        return editor ? { userId: editor.userId, username: editor.username } : null;
      }).filter(Boolean);
      io.to(`note-${noteId}`).emit('note_editors', { noteId, editors });
    });
    
    // User edits note content in real-time
    socket.on('note_edit', async (data: NoteEdit) => {
      // Broadcast to others in the note's room
      socket.to(`note-${data.noteId}`).emit('note_updated', data);
      
      // Don't save to DB on every keystroke - implement debounce in the client
      // This is just for broadcasting real-time changes
    });
    
    // User updates their cursor position
    socket.on('cursor_move', (data: { noteId: string, userId: string, position: number }) => {
      socket.to(`note-${data.noteId}`).emit('cursor_moved', data);
    });
    
    // User stops editing a note
    socket.on('stop_editing', ({ noteId, userId }: { noteId: string, userId: string }) => {
      socket.leave(`note-${noteId}`);
      // Remove user from the set of editors
      activeNotes.get(noteId)?.delete(userId);
      
      // If no one is editing this note anymore, remove it from the map
      if (activeNotes.get(noteId)?.size === 0) {
        activeNotes.delete(noteId);
      } else {
        // Notify others about updated editors list
        const editors = Array.from(activeNotes.get(noteId) || []).map(editorId => {
          const editor = activeUsers.find(user => user.userId === editorId);
          return editor ? { userId: editor.userId, username: editor.username } : null;
        }).filter(Boolean);
        
        io.to(`note-${noteId}`).emit('note_editors', { noteId, editors });
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      const userIndex = activeUsers.findIndex(user => user.socketId === socket.id);
      
      if (userIndex !== -1) {
        const user = activeUsers[userIndex];
        console.log(`${user.username} disconnected`);
        
        // Remove from active users
        activeUsers.splice(userIndex, 1);
        
        // Remove from all notes they were editing
        activeNotes.forEach((editors, noteId) => {
          if (editors.has(user.userId)) {
            editors.delete(user.userId);
            
            // Notify others
            const remainingEditors = Array.from(editors).map(editorId => {
              const editor = activeUsers.find(u => u.userId === editorId);
              return editor ? { userId: editor.userId, username: editor.username } : null;
            }).filter(Boolean);
            
            io.to(`note-${noteId}`).emit('note_editors', { noteId, remainingEditors });
          }
        });
        // Clean up empty notes
        Array.from(activeNotes.entries()).forEach(([noteId, editors]) => {
            if (editors.size === 0) {
              activeNotes.delete(noteId);
            }
          });
          
          // Broadcast updated user list
          io.emit('active_users', activeUsers);
        }
      });
    });
  };