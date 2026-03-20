// src/routes/excelRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { uploadExcel, getLatestData } = require('../controllers/excelController');

router.post('/upload', protect, upload.single('file'), uploadExcel);
router.get('/latest', protect, getLatestData);

module.exports = router;