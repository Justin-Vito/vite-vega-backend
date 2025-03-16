import express from 'express';
import Officials from '../models/officialModel.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../server.js';
import { Announcement } from '../models/announcementModel.js';

const router = express.Router();

// Login for officials (used in Login.jsx)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const official = await Officials.findOne({ where: { email } });
    if (!official || !(await bcrypt.compare(password, official.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: official.official_id, role: "officials" }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: "officials" });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
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