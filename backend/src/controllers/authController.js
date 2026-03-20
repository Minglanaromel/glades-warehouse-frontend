// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const loadUsers = () => {
  try {
    if (fs.existsSync(usersFilePath)) {
      return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@glades.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      department: 'Administration',
      plant: 'Both',
      employeeId: 'GLD-ADMIN-001',
      isActive: true
    },
    {
      id: 2,
      name: 'Test User',
      email: 'test.user@glades.com',
      password: bcrypt.hashSync('test123', 10),
      role: 'operator',
      department: 'Production',
      plant: 'Both',
      employeeId: 'GLD-2024-001',
      isActive: true
    }
  ];
};

const saveUsers = (users) => {
  try {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

let users = loadUsers();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, plant } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    if (users.find(u => u.email === email)) return res.status(400).json({ success: false, message: 'User already exists' });

    const newUser = {
      id: users.length + 1,
      name, email, password: bcrypt.hashSync(password, 10),
      role: role || 'operator', department: department || 'Production', plant: plant || 'Both',
      employeeId: `GLD-${Date.now()}`, isActive: true
    };
    users.push(newUser);
    saveUsers(users);
    res.status(201).json({ success: true, token: generateToken(newUser.id), user: { id: newUser.id, name, email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.json({ success: true, token: generateToken(user.id), user: { id: user.id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getUserProfile = async (req, res) => {
  const user = users.find(u => u.id === parseInt(req.user.id));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { password, ...userData } = user;
  res.json({ success: true, data: userData });
};

module.exports = { registerUser, loginUser, getUserProfile };