// /api/routes/sportResults.js
const express = require('express');
const router = express.Router();
const SportResult = require('../models/SportResult');

// GET    /api/sportResults
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, activity, author } = req.query;
  const filter = {};
  if (activity) filter.activity = activity;
  if (author)   filter.author = author;
  try {
    const items = await SportResult
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(Number(limit));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST   /api/sportResults
router.post('/', async (req, res) => {
  try {
    const item = await SportResult.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET    /api/sportResults/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await SportResult.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT    /api/sportResults/:id
router.put('/:id', async (req, res) => {
  try {
    const item = await SportResult.findOneAndUpdate(
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

// DELETE /api/sportResults/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await SportResult.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) 
      return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
