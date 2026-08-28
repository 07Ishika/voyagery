const express = require('express');
const { generateCostInsights } = require('../controllers/aiController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/ai/cost-insights', requireAuth, generateCostInsights);

module.exports = router;