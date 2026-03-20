// src/controllers/excelController.js
const excelParser = require('../utils/excelParser');
const fs = require('fs');

const uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload an Excel file' });
    const parsedData = excelParser.parseExcelFile(req.file.path);
    if (req.io) req.io.emit('excel-updated', parsedData);
    fs.unlinkSync(req.file.path);
    res.json({ success: true, message: 'Excel file processed successfully', data: { lastUpdate: parsedData.lastUpdate } });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Error processing Excel file', error: error.message });
  }
};

const getLatestData = async (req, res) => {
  res.json({ success: true, data: excelParser.getCurrentData() });
};

module.exports = { uploadExcel, getLatestData };