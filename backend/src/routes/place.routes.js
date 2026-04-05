const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');

// Obtener lugares (público)
router.get('/', (req, res) => {
  res.json({ message: 'Lista de lugares' });
});

// Crear lugar (protegido)
router.post('/', protect, (req, res) => {
  res.json({
    message: 'Lugar creado',
    user: req.user
  });
});

module.exports = router;