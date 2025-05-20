// /api/routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET    /api/events
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, author } = req.query;
  const filter = {};
  if (author) filter.author = author;
  try {
    const items = await Event
      .find(filter)
      .sort({ startDate: 1 })
      .skip((page-1)*limit)
      .limit(Number(limit));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST   /api/events
router.post('/', async (req, res) => {
  try {
    const item = await Event.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET    /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Event.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT    /api/events/:id
router.put('/:id', async (req, res) => {
  try {
    const item = await Event.findOneAndUpdate(
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

// DELETE /api/events/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Event.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) 
      return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
