const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processSip } = require('../services/ingestService');

const upload = multer({ dest: 'tmp/uploads/' });

router.post('/', upload.single('package'), async (req, res) => {
  try {
    const results = await processSip(req.file.path);
    res.status(201).json({ ingestados: results });
  } catch (err) {
    if (err.isValidation) {
      return res.status(400).json({ erro: err.message });
    }
    console.error(err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

module.exports = router;
