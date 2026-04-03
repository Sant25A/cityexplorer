const express = require('express');
const router = express.Router();

// Obtener lugares
router.get('/', (req, res) => {
  res.json({ message: 'Lista de lugares' });
});

// Crear lugar
router.post('/', (req, res) => {
  res.json({ message: 'Crear lugar' });
});

module.exports = router;