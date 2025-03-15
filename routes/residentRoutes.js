import express from 'express';
import Resident from '../models/Resident.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Add this import
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

// Get all residents (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const residents = await Resident.findAll();
    res.json(residents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new resident (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newResident = await Resident.create(req.body);
    res.status(201).json(newResident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a resident (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const resident = await Resident.findByPk(req.params.id);
    if (!resident) return res.status(404).json({ message: 'Resident not found' });
    await resident.destroy();
    res.json({ message: 'Resident deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Signup endpoint
router.post('/signup', async (req, res) => {
  console.log("Signup request received:", req.body);
  try {
    const { first_name, last_name, email, password, address, birth_date } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt here
    const newResident = await Resident.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      address,
      birth_date,
      household_id: 1,
      middle_int: req.body.middle_int || '',
      ext: req.body.ext || '',
      birth_place: req.body.birth_place || '',
      age: req.body.age || 0,
      gender: req.body.gender || '',
      contact_num: req.body.contact_num || 'N/A',
      civil_stat: req.body.civil_stat || '',
      citizenship: req.body.citizenship || '',
      occupation: req.body.occupation || '',
      status: req.body.status || ''
    });
    console.log("Resident created:", newResident);
    res.status(201).json({ message: 'Resident created', resident: newResident });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Login endpoint for residents
router.post('/login', async (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;
  try {
    const resident = await Resident.findOne({ where: { email } });
    if (!resident) {
      console.log("Resident not found for email:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, resident.password); // Use bcrypt here
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: resident.resident_id, role: 'residents' }, JWT_SECRET, { expiresIn: '1h' });
    console.log("Login successful, token generated:", token);
    res.json({ token, role: 'residents' });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;