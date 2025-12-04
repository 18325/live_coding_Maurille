import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

console.log('Socket URL configured:', SOCKET_URL);

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    console.log('Connecting to socket with userId:', userId);
    this.socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinNote(noteId: string): void {
    if (this.socket) {
      console.log('Joining note:', noteId);
      this.socket.emit('join-note', noteId);
    }
  }

  leaveNote(noteId: string): void {
    if (this.socket) {
      console.log('Leaving note:', noteId);
      this.socket.emit('leave-note', noteId);
    }
  }

  updateNote(noteId: string, content: string): void {
    if (this.socket) {
      this.socket.emit('note-update', { noteId, content });
    }
  }

  onNoteUpdate(callback: (data: { noteId: string; content: string; userId: string }) => void): void {
    if (this.socket) {
      this.socket.on('note-updated', callback);
    }
  }

  onActiveNotes(callback: (activeNotes: any[]) => void): void {
    if (this.socket) {
      this.socket.on('active-notes', callback);
    }
  }

  offNoteUpdate(): void {
    if (this.socket) {
      this.socket.off('note-updated');
    }
  }

  offActiveNotes(): void {
    if (this.socket) {
      this.socket.off('active-notes');
    }
  }
}

export default new SocketService();
