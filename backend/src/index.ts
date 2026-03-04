import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { setupDatabase } from './config/database';
import { setupRedis } from './config/redis';
import { setupOpenAI } from './config/openai';
import { errorHandler } from './middleware/errorHandler';
import { setupSocketHandlers } from './services/socketService';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import bookRoutes from './routes/books';
import matchingRoutes from './routes/matching';
import chatRoutes from './routes/chat';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '3.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Initialize services and start server
async function startServer() {
  try {
    // Setup database
    await setupDatabase();
    console.log('✅ Database connected');

    // Setup Redis
    await setupRedis();
    console.log('✅ Redis connected');

    // Setup OpenAI
    setupOpenAI();
    console.log('✅ OpenAI configured');

    // Setup Socket.io handlers
    setupSocketHandlers(io);
    console.log('✅ Socket.io handlers configured');

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 Read Detective V3 API is ready!`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { io };
