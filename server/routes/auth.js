import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/Schemas.js';
import { isDbConnected, mockDb } from '../models/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'courtroom_secret_token';

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    if (isDbConnected) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already exists' });

      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } else {
      const existing = mockDb.users.find(u => u.email === email);
      if (existing) return res.status(400).json({ error: 'Email already exists' });

      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        email,
        password: hashedPassword,
        role
      };
      mockDb.users.push(newUser);
      return res.status(201).json({ message: 'User registered successfully (In-Memory)', userId: newUser._id });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    let user = null;
    if (isDbConnected) {
      user = await User.findOne({ email });
    } else {
      user = mockDb.users.find(u => u.email === email);
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

export default router;
