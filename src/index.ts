import http from 'http';
import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import config from './configs/config.js';
import { usersRouter, vehiclesRouter, customerRoutes, authRoutes } from './routes/index.js';
import { syncDatabase } from './configs/sync.js';
import { configurePassport } from './configs/passport.js';
import favoriteRoutes from './routes/favorite.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://si-blue-frontend.onrender.com'],
  }),
);
configurePassport();

app.use(passport.initialize());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://si-blue-frontend.onrender.com'],
    credentials: true,
  },
});

const userSockets = new Map();

io.on('connection', socket => {
  socket.on('register', (userId: number) => {
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);
    socket.on('disconnect', () => {
      userSockets.get(userId)?.delete(socket.id);
      if (userSockets.get(userId)?.size === 0) {
        userSockets.delete(userId);
      }
    });
  });
});

export const forceLogoutUser = (userId: number) => {
  const sockets = userSockets.get(userId);
  if (sockets) {
    for (const socketId of sockets) {
      io.to(socketId).emit('forceLogout');
    }
  }
};

const port = config.port as number;

app.use('/api/users', usersRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/customers', customerRoutes);

syncDatabase()
  .then(() => {
    console.log('Models initialized');
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.log("Models didn't initialize");
    console.log(err.stack);
  });
