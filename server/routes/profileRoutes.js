const express = require('express');
const profileController = require('../controllers/profileController');
const { requireAuth, requireSelf } = require('../middleware/auth');

const router = express.Router();

router.get('/profile/:userId', requireAuth, requireSelf, profileController.getProfile.bind(profileController));
router.post('/profile', requireAuth, requireSelf, profileController.saveProfile.bind(profileController));
router.patch('/profile/:userId/verification', requireAuth, requireSelf, profileController.updateVerification.bind(profileController));
router.post('/create-guide-profile', requireAuth, requireSelf, profileController.createGuideProfile.bind(profileController));
router.get('/guides/search', profileController.searchGuides.bind(profileController));

module.exports = router;
