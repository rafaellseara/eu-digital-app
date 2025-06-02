// api/routes/ingest.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticate } = require('../middleware/auth');
const { processSip } = require('../services/ingestService');

// Configura o multer para gravar temporariamente em tmp/uploads/
const upload = multer({ dest: 'tmp/uploads/' });

// POST /api/ingest
// Protegido: só utilizadores autenticados podem fazer upload de SIP
router.post(
  '/',
  authenticate,
  upload.single('package'),
  async (req, res) => {
    try {
      const ids = await processSip(req.file.path, req.user.id);
      res.status(201).json({ ingested: ids });
    } catch (err) {
      if (err.isValidation) {
        return res.status(400).json({ error: err.message });
      }
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
