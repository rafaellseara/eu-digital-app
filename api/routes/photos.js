// api/routes/photos.js
const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const User = require('../models/User');
const { authenticate, authenticateOptional } = require('../middleware/auth');

// Listar fotos com paginação e filtros, respeitando visibilidade
// GET /api/photos
router.get('/', authenticateOptional, async (req, res) => {
  const { page = 1, limit = 20, tag, author } = req.query;
  const filter = {};

  if (!req.user) {
    filter.visibility = 'public';
  } else {
    filter.$or = [
      { visibility: 'public' },
      { ownerId: req.user.id },
      { $and: [{ visibility: 'friends' }, { ownerId: { $in: req.user.friends || [] } }] }
    ];
  }
  if (tag) filter.tags = tag;
  if (author) filter.author = author;

  try {
    const photos = await Photo.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar foto (só utilizadores autenticados)
// POST /api/photos
router.post('/', authenticate, async (req, res) => {
  try {
    const data = {
      ...req.body,
      ownerId: req.user.id,
      author: req.user.username
    };
    const photo = await Photo.create(data);
    res.status(201).json(photo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obter foto por ID com verificação de visibilidade
// GET /api/photos/:id
router.get('/:id', authenticateOptional, async (req, res) => {
  try {
    const photo = await Photo.findOne({ id: req.params.id });
    if (!photo) return res.status(404).json({ error: 'Not found' });

    const { visibility, ownerId } = photo;
    if (visibility === 'public') {
      return res.json(photo);
    }
    if (!req.user) {
      return res.status(403).json({ error: 'Requer autenticação para ver este recurso.' });
    }
    if (visibility === 'private' && ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    if (visibility === 'friends') {
      const owner = await User.findOne({ id: ownerId });
      if (!owner || !(owner.friends || []).includes(req.user.id)) {
        return res.status(403).json({ error: 'Acesso apenas para amigos.' });
      }
    }
    return res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar foto (apenas owner)
// PUT /api/photos/:id
router.put('/:id', authenticate, async (req, res) => {
  try {
    const photo = await Photo.findOne({ id: req.params.id });
    if (!photo) return res.status(404).json({ error: 'Not found' });
    if (photo.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Só o criador pode atualizar.' });
    }
    const updates = { ...req.body };
    delete updates.ownerId;
    const updated = await Photo.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar foto (apenas owner)
// DELETE /api/photos/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const photo = await Photo.findOne({ id: req.params.id });
    if (!photo) return res.status(404).json({ error: 'Not found' });
    if (photo.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Só o criador pode eliminar.' });
    }
    await Photo.deleteOne({ id: req.params.id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
