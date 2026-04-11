const express = require('express');
const router = express.Router();

const protect = require('../middlewares/auth.middleware');
const { 
  createPlace, 
  getPlaces, 
  getPlaceById, 
  updatePlace,
  deletePlace 
} = require('../controllers/place.controller');

// Obtener lugares (público)
router.get('/', getPlaces);

// Obtener lugar por ID (público)
router.get('/:id', getPlaceById);

// Actualizar lugar (protegido)
router.put('/:id', protect, updatePlace);

// Crear lugar (protegido)
router.post('/', protect, createPlace);

// Eliminar lugar (protegido)
router.delete('/:id', protect, deletePlace);

module.exports = router;