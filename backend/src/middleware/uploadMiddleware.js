// src/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `excel-${Date.now()}${path.extname(file.originalname)}`)
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only Excel files are allowed'), false);
};

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });
module.exports = upload;