import express from 'express';
import { Officials } from '../models/officialModel.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../server.js';
import { Announcement } from '../models/announcementModel.js';

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};


// Login for officials (used in Login.jsx)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Official login request:", req.body);
  try {
    const official = await Official.findOne({ where: { email } });
    if (!official) return res.status(404).json({ message: "Official not found" });
    const match = await bcrypt.compare(password, official.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: official.official_id, role: "officials" }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Login successful", token, role: "officials" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.findAll();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post('/announcements', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Missing title or content" });
  }
  try {
    const announcement = await Announcement.create({ title, content });
    res.status(201).json({ message: "Announcement created", announcement });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


export default router;