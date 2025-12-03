import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { initializeSocket } from './socket/socket.js';


const PORT = process.env.PORT || 5000;

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// CORS configuration - UPDATED
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://192.168.1.59:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Initialize Socket.io
initializeSocket(server);

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', (await import('./routes/authRoutes.js')).default);
app.use('/api/chat', (await import('./routes/chatRoutes.js')).default);
app.use('/api/message', (await import('./routes/messageRoutes.js')).default);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MERN Chat API is running!' });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});


server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://192.168.1.59:${PORT}`);
});