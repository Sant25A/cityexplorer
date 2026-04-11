const express = require('express');
const router = express.Router();

const protect = require('../middlewares/auth.middleware');
const {
    toggleFavorite,
    getFavorites
} = require('../controllers/favorite.controller');

// Obtener favoritos del usuario
router.get('/', protect, getFavorites);

// Toggle favorito
router.post('/', protect, toggleFavorite);

module.exports = router;