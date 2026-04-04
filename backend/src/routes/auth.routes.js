const express = require('express');
const router = express.Router();
const { register } = require('../controllers/auth.controller');

// Registro real
router.post('/register', register);

// // Registro
// router.post('/register', (req, res) => {
//   res.json({ message: 'Registro endpoint listo' });
// });

// Login
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint listo' });
});

module.exports = router;