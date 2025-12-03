import { Server } from 'socket.io';
import User from '../models/User.js';

let io;
const userSocketMap = new Map();

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('setup', (userData) => {
      socket.join(userData._id);
      userSocketMap.set(userData._id, socket.id);
      socket.emit('connected');
      
      User.findByIdAndUpdate(userData._id, { 
        isOnline: true,
        lastSeen: new Date()
      }).exec();
    });

    socket.on('join chat', (room) => {
      socket.join(room);
      console.log('User Joined Room: ' + room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessageRecieved) => {
      const chat = newMessageRecieved.chat;

      if (!chat.users) return console.log('chat.users not defined');

      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
        socket.in(user._id).emit('message received', newMessageRecieved);
      });
    });

    socket.on('disconnect', () => {
      console.log('USER DISCONNECTED');
      
      for (let [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          User.findByIdAndUpdate(userId, { 
            isOnline: false,
            lastSeen: new Date()
          }).exec();
          break;
        }
      }
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export { initializeSocket, getIo };