// /api/routes/photos.js
const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');

// GET    /api/photos
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, tag, author } = req.query;
  const filter = {};
  if (tag)    filter.tags = tag;
  if (author) filter.author = author;
  try {
    const photos = await Photo
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(Number(limit));
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST   /api/photos
router.post('/', async (req, res) => {
  try {
    const photo = await Photo.create(req.body);
    res.status(201).json(photo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET    /api/photos/:id
router.get('/:id', async (req, res) => {
  try {
    const photo = await Photo.findOne({ id: req.params.id });
    if (!photo) return res.status(404).json({ error: 'Not found' });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT    /api/photos/:id
router.put('/:id', async (req, res) => {
  try {
    const photo = await Photo.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!photo) return res.status(404).json({ error: 'Not found' });
    res.json(photo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/photos/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Photo.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) 
      return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
