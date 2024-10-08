import express from 'express';
import cors from 'cors';
import userRouter from './routers/userRoutes.js';
import cookieParser from 'cookie-parser';

// Start express app
const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://pepe-api.onrender.com',
      'https://pepe-coin-app.vercel.app',
      'https://pepelayer2.com',
    ], // Allow both local and production origins
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // If you need to send cookies or authentication headers
  })
);

app.use(express.json());

app.enable('trust proxy');
app.use(cookieParser());

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Welcome to PEPE COIN API' });
});

app.get('/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

// ROUTES
app.use('/', userRouter);

export default app;
