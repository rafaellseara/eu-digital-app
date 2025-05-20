// /api/routes/academicResults.js
const express = require('express');
const router = express.Router();
const AcademicResult = require('../models/AcademicResult');

// GET    /api/academicResults
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, institution, author } = req.query;
  const filter = {};
  if (institution) filter.institution = institution;
  if (author)      filter.author = author;
  try {
    const items = await AcademicResult
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(Number(limit));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST   /api/academicResults
router.post('/', async (req, res) => {
  try {
    const item = await AcademicResult.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET    /api/academicResults/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await AcademicResult.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT    /api/academicResults/:id
router.put('/:id', async (req, res) => {
  try {
    const item = await AcademicResult.findOneAndUpdate(
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

// DELETE /api/academicResults/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await AcademicResult.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) 
      return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
