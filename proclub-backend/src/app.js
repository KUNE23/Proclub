import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import moduleRoutes from './routes/modulesRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import userRoutes from './routes/userRoutes.js';
import memberDashboardRoutes from './routes/memberDashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import upcomingEventRoutes from './routes/upcomingEventRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import path from 'path';

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.APP_URL
].filter(Boolean);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  allowedHeaders: ['Content-Type', 'Authorization'], 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'src', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', projectRoutes);
app.use('/api', courseRoutes);
app.use('/api', moduleRoutes);
app.use('/api', quizRoutes);
app.use('/api', notificationRoutes);
app.use('/api', certificateRoutes);
app.use('/api', upcomingEventRoutes);
app.use('/api', contactRoutes);
app.use('/api', userRoutes);
app.use('/api', memberDashboardRoutes);

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
