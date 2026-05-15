import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import moduleRoutes from './routes/modulesRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: 'http://localhost:5173',
  allowedHeaders: ['Content-Type', 'Authorization'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', categoryRoutes);
app.use('/api', projectRoutes);
app.use('/api', courseRoutes);
app.use('/api', moduleRoutes);
app.use('/api', quizRoutes);
app.use('/api', userRoutes);

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ status: 'fail', message: 'Image size must be 2MB or less' });
  }

  if (err.message && err.message.includes('Only jpeg, jpg, png, and webp image files are allowed')) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }

  console.error(err);
  return res.status(500).json({ status: 'error', message: err.message || 'Server Error' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});