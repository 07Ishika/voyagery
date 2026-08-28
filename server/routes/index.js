const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  notificationController,
  dashboardController,
  supportController
} = require('../controllers/miscController');

const router = express.Router();

router.use(requireAuth);

// Notifications
router.get('/notifications/:userId', notificationController.list.bind(notificationController));
router.put('/notifications/:notificationId/read', notificationController.markRead.bind(notificationController));
router.post('/notifications', notificationController.create.bind(notificationController));

// Dashboard
router.get('/dashboard/:userId', dashboardController.getStats.bind(dashboardController));

// Migrant requests
router.get('/migrant-requests', supportController.listMigrantRequests.bind(supportController));
router.post('/migrant-requests', supportController.createMigrantRequest.bind(supportController));
router.put('/migrant-requests/:requestId', supportController.updateMigrantRequest.bind(supportController));

// Messages
router.get('/messages/:conversationId', supportController.listMessages.bind(supportController));
router.post('/messages', supportController.sendMessage.bind(supportController));

// Reviews
router.get('/reviews/:guideId', supportController.listReviews.bind(supportController));
router.post('/reviews', supportController.createReview.bind(supportController));

module.exports = router;
