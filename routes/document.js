import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Document from '../models/Document.js';
import auth from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Upload document
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  const { name, description, expiryDate, category } = req.body;
  const newDoc = new Document({
    userId: req.user.id,
    name,
    description,
    expiryDate,
    category,
    fileUrl: req.file.path
  });
  await newDoc.save();
  res.json(newDoc);
});

// Get all documents
router.get('/', auth, async (req, res) => {
  const docs = await Document.find({ userId: req.user.id });
  res.json(docs);
});

// Edit document
// Edit document and optionally replace file
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    // If new file uploaded, delete old one
    if (req.file) {
      try {
        const oldFilePath = path.join(__dirname, '..', doc.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
        doc.fileUrl = req.file.path;
      } catch (err) {
        console.error('Failed to delete old file:', err);
      }
    }

    doc.name = req.body.name;
    doc.description = req.body.description;
    doc.expiryDate = req.body.expiryDate;
    doc.category = req.body.category;

    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error('Edit error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Delete document and file
router.delete('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    const filePath = path.join(__dirname, '..', doc.fileUrl);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('File delete failed:', err);
        return res.status(500).json({ msg: 'Document deleted, but file not removed.' });
      }
      res.json({ msg: 'Document and file deleted successfully' });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Notifications - expiring in 30 days
router.get('/notifications/soon', auth, async (req, res) => {
  const now = new Date();
  const threshold = new Date();
  threshold.setDate(now.getDate() + 30);

  const docs = await Document.find({
    userId: req.user.id,
    expiryDate: { $lte: threshold, $gte: now }
  });

  res.json(docs);
});

router.get('/stats', auth, async (req, res) => {
  const docs = await Document.find({ userId: req.user.id });
  const now = new Date();

  const expired = docs.filter(doc => new Date(doc.expiryDate) < now);
  const red = docs.filter(doc => {
    const days = (new Date(doc.expiryDate) - now) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 7;
  });
  const yellow = docs.filter(doc => {
    const days = (new Date(doc.expiryDate) - now) / (1000 * 60 * 60 * 24);
    return days > 7 && days <= 15;
  });
  const green = docs.filter(doc => {
    const days = (new Date(doc.expiryDate) - now) / (1000 * 60 * 60 * 24);
    return days > 15 && days <= 30;
  });
  const later = docs.filter(doc => {
    const days = (new Date(doc.expiryDate) - now) / (1000 * 60 * 60 * 24);
    return days > 30;
  });

  res.json({
    total: docs.length,
    expired: expired.length,
    red: red.length,
    yellow: yellow.length,
    green: green.length,
    later: later.length,
  });
});


export default router;
