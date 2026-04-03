const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Lista de reviews' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Crear review' });
});

module.exports = router;