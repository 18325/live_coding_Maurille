// src/server.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectDB } from './config/db';
import usersRoutes from './routes/users';
import notesRoutes from './routes/notes';
import { setupNoteSocketHandlers } from './socketHandlers/noteHandler';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/notes', notesRoutes);

// Set up Socket.io handlers
setupNoteSocketHandlers(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});