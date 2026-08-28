const express = require('express');
const callController = require('../controllers/callController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/scheduled-calls', requireAuth, callController.list.bind(callController));
router.post('/scheduled-calls', requireAuth, callController.create.bind(callController));
router.put('/scheduled-calls/:callId', requireAuth, callController.update.bind(callController));
router.delete('/scheduled-calls/:callId', requireAuth, callController.remove.bind(callController));

module.exports = router;
