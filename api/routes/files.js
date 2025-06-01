// /api/routes/file.js
const express = require('express');
const router = express.Router();
const File = require('../models/File');
const path = require('path');

// GET    /api/file
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, activity, author } = req.query;
  const filter = {};
  if (activity) filter.activity = activity;
  if (author)   filter.author = author;
  try {
    const items = await File
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(Number(limit));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST   /api/file
router.post('/', async (req, res) => {
  try {
    const item = await File.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET    /api/file/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await File.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT    /api/file/:id
router.put('/:id', async (req, res) => {
  try {
    const item = await File.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/file/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await File.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) 
      return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/file/:id/download
router.get('/:id/download', async (req, res) => {
  try {
    const item = await File.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Not found' });

    const date = new Date(item.createdAt);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const base = "files";

    const filePath = path.join(__dirname, '../storage', base, String(year), month, item.id + "." + item.format);

    res.download(filePath, item.originalName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
