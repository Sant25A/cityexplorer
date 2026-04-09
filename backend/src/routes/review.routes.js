const express = require('express');
const router = express.Router();

const protect = require('../middlewares/auth.middleware');
const {
  createReview,
  getReviewsByPlace
} = require('../controllers/review.controller');

// Obtener reviews de un lugar
router.get('/:placeId', getReviewsByPlace);

// Crear review (protegido)
router.post('/', protect, createReview);

module.exports = router;