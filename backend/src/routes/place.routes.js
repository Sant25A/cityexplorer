const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');

const protect = require('../middlewares/auth.middleware');
const { 
  createPlace, 
  getPlaces, 
  getPlaceById, 
  updatePlace,
  deletePlace, 
  getMyPlaces 
} = require('../controllers/place.controller');

/* RUTAS PÚBLICAS */
// Obtener lugares
router.get('/', getPlaces);
// Obtener lugares por usuario (Protegida pero se carga antes que por id)
router.get('/me', protect, getMyPlaces);
// Obtener lugar por ID
router.get('/:id', getPlaceById);

/* RUTAS PROTEGIDAS */
// Crear lugar con imágenes
router.post(
  '/',
  protect,
  upload.array('images', 5), // Permitir hasta 5 imágenes
  createPlace
)
// Actualizar lugar
router.put('/:id', protect, updatePlace);
// Eliminar lugar
router.delete('/:id', protect, deletePlace);

module.exports = router;