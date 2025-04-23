// backend/src/middleware/upload.js
const multer = require('multer');
const fs = require('fs');
const uploadDir = 'uploads';

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => 
    cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`)
});

module.exports = multer({ storage });
