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
  console.log("Signup request body:", req.body);
  const {
    first_name,
    last_name,
    email,
    password,
    middle_int = "",
    birth_date = null,
    address = ""
  } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "Validation error" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newResident = await Resident.create({
      first_name,
      last_name,
      middle_int,
      birth_date,
      address,
      email,
      password: hashedPassword,
      household_id: 1, // Default or adjust
      ext: "",
      birth_place: "",
      age: 0,
      gender: "",
      contact_num: "N/A",
      civil_stat: "",
      citizenship: "",
      occupation: "",
      status: ""
    });
    console.log("Resident created:", newResident);
 res.status(201).json({ message: "Resident created", resident: newResident });
  } catch (error) {
    console.error("Signup error:", error.name, error.message);
     if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message })
  }
});
router.post('/appointments', async (req, res) => {
  const { title, date, content } = req.body;
  if (!title || !date || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const appointment = await Appointment.create({ title, date, content });
    res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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