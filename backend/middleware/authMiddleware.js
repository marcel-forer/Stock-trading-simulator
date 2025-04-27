// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ message: 'Access Denied. Invalid token format.' });
}
const token = authHeader.split(' ')[1]; // Extract actual tokens


  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateUser;
