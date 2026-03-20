// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getDashboardStats, getCapacityData, getMachineStatus, getDowntime,
  getAttendance, getHourlyProduction, getTroubleReports
} = require('../controllers/dashboardController');

router.get('/stats', protect, getDashboardStats);
router.get('/capacity', protect, getCapacityData);
router.get('/machines', protect, getMachineStatus);
router.get('/downtime', protect, getDowntime);
router.get('/attendance', protect, getAttendance);
router.get('/hourly', protect, getHourlyProduction);
router.get('/trouble-reports', protect, getTroubleReports);

module.exports = router;