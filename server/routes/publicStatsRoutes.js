const express = require('express');
const publicStatsController = require('../controllers/publicStatsController');

const router = express.Router();

router.get('/public-stats', publicStatsController.getStats.bind(publicStatsController));

module.exports = router;