const express = require('express');
const sessionController = require('../controllers/sessionController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/guide-sessions', requireAuth, sessionController.list.bind(sessionController));
router.post('/guide-sessions', requireAuth, sessionController.create.bind(sessionController));
// realtime before :sessionId so "realtime" is not captured as an id
router.get('/guide-sessions/realtime/:guideId', requireAuth, sessionController.realtime.bind(sessionController));
router.get('/guide-sessions/:sessionId', requireAuth, sessionController.getById.bind(sessionController));
router.put('/guide-sessions/:sessionId', requireAuth, sessionController.update.bind(sessionController));
router.delete('/guide-sessions/:sessionId', requireAuth, sessionController.remove.bind(sessionController));

module.exports = router;
