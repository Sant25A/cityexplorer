// backend/src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Importamos ambos middlewares de protección
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Aplicamos protección global a todas las rutas de este archivo
router.use(authMiddleware);
router.use(adminMiddleware);

// Endpoints administrativos
router.get('/users', adminController.getAllUsers);
router.get('/places', adminController.getAllPlaces);
router.delete('/places/:id', adminController.deletePlaceByAdmin);

module.exports = router;