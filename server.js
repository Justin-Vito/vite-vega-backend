import express from 'express';
import https from 'https';
import fs from 'fs';
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
  origin: true,
  credentials: true,
}));

const options = {
key: fs.readFileSync('key.pem'),
cert: fs.readFileSync('cert.pem'),
};

app.use('/api/residents', residentRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/officials', officialRoutes);

const PORT = process.env.PORT || 5003;

https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ${PORT} with HTTPS');
});
export const JWT_SECRET = process.env.JWT_SECRET;
