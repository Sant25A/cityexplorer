const express = require('express');
const router = express.Router();

// Registro
router.post('/register', (req, res) => {
  res.json({ message: 'Registro endpoint listo' });
});

// Login
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint listo' });
});

module.exports = router;