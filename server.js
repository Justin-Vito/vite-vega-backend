import express from 'express';
import cors from 'cors';
import db from './dbconnect.js';
import residentRoutes from './routes/residentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/residents', residentRoutes);
app.use('/api/admins', adminRoutes);

const PORT = 5003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export const JWT_SECRET = 'your-secret-key'; // Replace with a secure key in production