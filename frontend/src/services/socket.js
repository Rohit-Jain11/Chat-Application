import { io } from 'socket.io-client';

// Use direct connection in development
const isDevelopment = import.meta.env.MODE === 'development';
const SOCKET_URL = isDevelopment 
  ? 'http://localhost:5000' 
  : window.location.origin;

console.log('🔌 Socket connecting to:', SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: false,  // ✅ Change back to false - we'll control connection manually
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Track if setup has been sent
let setupSent = false;
let currentUserData = null;

export const connectSocket = (userData) => {
  if (!userData || !userData._id) {
    console.error('❌ Invalid user data for socket connection');
    return;
  }

  console.log('🔌 Connecting socket for user:', userData.name);
  
  // Store user data
  currentUserData = userData;
  socket.auth = { userData };

  // Connect if not already connected
  if (!socket.connected) {
    socket.connect();
  } else if (!setupSent) {
    // If already connected but setup not sent, send it now
    console.log('🔄 Socket already connected, sending setup');
    socket.emit('setup', userData);
    setupSent = true;
  }
};

export const disconnectSocket = () => {
  console.log('🔌 Disconnecting socket');
  setupSent = false;
  currentUserData = null;
  socket.disconnect();
};

// ===========================================================
// 🔥 SOCKET EVENT LISTENERS - UPDATED
// ===========================================================

// When socket connects
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
  
  // ✅ CRITICAL FIX: Only emit setup if we have user data
  if (currentUserData && !setupSent) {
    console.log('👤 Emitting setup for user:', currentUserData.name);
    socket.emit('setup', currentUserData);
    setupSent = true;
  }
});

// When socket disconnects
socket.on('disconnect', (reason) => {
  console.log('❌ Socket disconnected:', reason);
  setupSent = false;
});

// Connection error
socket.on('connect_error', (error) => {
  console.error('💥 Socket connection error:', error);
  setupSent = false;
});

// Reconnection attempts
socket.on('reconnect_attempt', (attemptNumber) => {
  console.log(`🔄 Reconnection attempt ${attemptNumber}`);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('✅ Socket reconnected');
  // Resend setup after reconnection
  if (currentUserData) {
    console.log('🔄 Resending setup after reconnect');
    socket.emit('setup', currentUserData);
    setupSent = true;
  }
});

// Debug incoming messages
socket.on('message received', (data) => {
  console.log('📨 Message received via socket:', data);
});

// Add this for debugging all socket events
socket.onAny((event, ...args) => {
  console.log(`📡 Socket event [${event}]:`, args);
});