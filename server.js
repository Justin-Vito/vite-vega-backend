import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './dbconnect.js';
import residentRoutes from './routes/residentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import officialRoutes from './routes/officialRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vercel URL later
  credentials: true,
}));

app.use('/api/residents', residentRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/officials', officialRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export const JWT_SECRET = process.env.JWT_SECRET;
