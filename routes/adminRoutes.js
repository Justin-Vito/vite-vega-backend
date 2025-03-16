import express from 'express';
import Admin from '../models/Admin.js';
import Announcement from '../models/Announcement.js';
import bcrypt from 'bcryptjs';
import { Official } from '../models/officialModel.js';
import { Appointment } from '../models/appointmentModel.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../server.js';

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.official_id, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: admin.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all admins (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new admin (protected, with password hashing)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newAdmin = await Admin.create({ ...req.body, password: hashedPassword });
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Post announcement (protected)
router.post('/announcements', authenticateToken, async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      created_by: req.user.id,
    });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all announcements (public for now)
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.findAll();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/create-official', async (req, res) => {
  const { first_name, last_name, middle_int, birth_date, position, email, password } = req.body;
  if (!first_name || !last_name || !position || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const official = await Official.create({
      first_name, last_name, middle_int, birth_date, position, email, password: hashedPassword
    });
    res.status(201).json({ message: "Official created", official });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Email already exists" });
    }
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;