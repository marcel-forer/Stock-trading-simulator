// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// Input validation function
const isValidInput = (input) => typeof input === 'string' && input.trim().length > 0;

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  // Validate input
  if (!isValidInput(username) || !isValidInput(password)) {
    return res.status(400).json({ error: "Username and password cannot be empty." });
  }

  try {
    // Check if username is already taken
    const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists. Choose another one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, password, balance) VALUES ($1, $2, $3) RETURNING *",
      [username, hashedPassword, 10000] // Give new users a starting balance
    );

    res.json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed. Please try again later." });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user.rows[0].id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
