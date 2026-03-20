// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const loadUsers = () => {
  try {
    if (fs.existsSync(usersFilePath)) return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  } catch (error) {}
  return [];
};

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const users = loadUsers();
      req.user = users.find(u => u.id === decoded.id);
      if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized' });
    }
  }
  if (!token) res.status(401).json({ success: false, message: 'Not authorized, no token' });
};

module.exports = { protect };