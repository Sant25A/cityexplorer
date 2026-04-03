const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Lista de favoritos' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Agregar favorito' });
});

module.exports = router;