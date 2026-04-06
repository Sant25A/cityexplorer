const express = require('express');
const router = express.Router();

const protect = require('../middlewares/auth.middleware');
const { createPlace } = require('../controllers/place.controller');

// Obtener lugares (público)
router.get('/', (req, res) => {
  res.json({ message: 'Lista de lugares' });
});

// Crear lugar (protegido)
router.post('/', protect, createPlace);

module.exports = router;