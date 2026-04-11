const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/places', require('./place.routes'));
router.use('/reviews', require('./review.routes'));
router.use('/favorites', require('./favorite.routes'));

module.exports = router;