// /api/routes/texts.js
const express = require('express');
const router = express.Router();
const Text = require('../models/Text');

// GET    /api/texts
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, tag, author } = req.query;
  const filter = {};
  if (tag)    filter.tags = tag;
  if (author) filter.author = author;
  try {
    const items = await Text
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(Number(limit));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST   /api/texts
router.post('/', async (req, res) => {
  try {
    const item = await Text.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET    /api/texts/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Text.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT    /api/texts/:id
router.put('/:id', async (req, res) => {
  try {
    const item = await Text.findOneAndUpdate(
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

// DELETE /api/texts/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Text.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) 
      return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
