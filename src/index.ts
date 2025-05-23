import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './configs/config.js';
import { usersRouter, vehiclesRouter } from './routes/index.js';
import { syncDatabase } from './configs/sync.js';
import { configurePassport } from './configs/passport.js';
import authRoutes from './routes/auth.js';

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

const port = config.port as number;

app.use('/api/users', usersRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/auth', authRoutes);

syncDatabase()
  .then(() => {
    console.log('Models initialized');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.log("Models didn't initialize");
    console.log(err.stack);
  });
