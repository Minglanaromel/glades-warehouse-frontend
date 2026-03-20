// src/controllers/dashboardController.js
const excelParser = require('../utils/excelParser');

const getDashboardStats = async (req, res) => {
  try {
    const data = excelParser.getCurrentData();
    res.json({ success: true, data: data.dashboardStats || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching dashboard stats' });
  }
};

const getCapacityData = async (req, res) => {
  res.json({ success: true, data: excelParser.getCurrentData().capacity || [] });
};

const getMachineStatus = async (req, res) => {
  res.json({ success: true, data: excelParser.getCurrentData().machines || [] });
};

const getDowntime = async (req, res) => {
  res.json({ success: true, data: excelParser.getCurrentData().downtime || [] });
};

const getAttendance = async (req, res) => {
  res.json({ success: true, data: excelParser.getCurrentData().attendance || {} });
};

const getHourlyProduction = async (req, res) => {
  const data = excelParser.getCurrentData().hourlyProduction || [];
  const { machine } = req.query;
  res.json({ success: true, data: machine && machine !== 'all' ? data.filter(p => p.machine === machine) : data });
};

const getTroubleReports = async (req, res) => {
  res.json({ success: true, data: excelParser.getCurrentData().troubleReports || [] });
};

module.exports = { getDashboardStats, getCapacityData, getMachineStatus, getDowntime, getAttendance, getHourlyProduction, getTroubleReports };