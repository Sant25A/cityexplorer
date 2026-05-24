const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin.routes');

router.use('/auth', require('./auth.routes'));
router.use('/places', require('./place.routes'));
router.use('/reviews', require('./review.routes'));
router.use('/favorites', require('./favorite.routes'));
router.use('/admin', adminRoutes);

module.exports = router;