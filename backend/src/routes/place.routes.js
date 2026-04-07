const express = require('express');
const router = express.Router();

const protect = require('../middlewares/auth.middleware');
const { createPlace, getPlaces } = require('../controllers/place.controller');

// Obtener lugares (público)
router.get('/', getPlaces);

// Crear lugar (protegido)
router.post('/', protect, createPlace);

module.exports = router;