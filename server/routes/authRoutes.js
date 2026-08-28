const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

// Google OAuth — store selected role on session before redirect
router.get('/google', (req, res, next) => {
  const { role } = req.query;
  if (role) {
    req.session.oauthRole = role;
    return req.session.save((err) => {
      if (err) console.error('Session save error:', err);
      next();
    });
  }
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: true
  }),
  (req, res) => {
    console.log('✅ OAuth callback successful - User:', req.user?.displayName, 'Role:', req.user?.role);
    const user = req.user;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    if (user && user.role === 'guide') {
      return res.redirect(`${clientUrl}/home/guide`);
    }
    if (user && user.role === 'migrant') {
      return res.redirect(`${clientUrl}/home`);
    }
    return res.redirect(`${clientUrl}/role`);
  }
);

router.get('/failure', authController.authFailure.bind(authController));
router.post('/demo-login', authController.demoLogin.bind(authController));
router.get('/demo-users', authController.demoUsers.bind(authController));
router.post('/manual-login', authController.manualLogin.bind(authController));
router.get('/user', authController.getCurrentUser.bind(authController));
router.post('/set-role', authController.setRole.bind(authController));
router.get('/logout', authController.logout.bind(authController));

module.exports = router;
