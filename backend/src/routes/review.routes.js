const express = require('express');
const router = express.Router();

const protect = require('../middlewares/auth.middleware');
const {
  createReview,
  getReviewsByPlace,
  updateReview,
  deleteReview
} = require('../controllers/review.controller');

// Obtener reviews de un lugar
router.get('/:placeId', getReviewsByPlace);

// Crear review (protegido)
router.post('/', protect, createReview);

// Editar review (protegido)
router.put('/:id', protect, updateReview);

// Eliminar review (protegido)
router.delete('/:id', protect, deleteReview);

module.exports = router;