const authService = require('../services/authService');
const { sendError } = require('../utils/sendError');

class AuthController {
  async demoLogin(req, res) {
    try {
      const user = await authService.demoLogin(req.body);
      authService.establishSession(req, user);
      console.log('✅ Demo login successful for:', user.displayName, '(Role:', user.role, ')');
      res.json(user);
    } catch (err) {
      sendError(res, err, 'Login failed');
    }
  }

  async demoUsers(req, res) {
    try {
      const users = await authService.listDemoUsers();
      res.json(users);
    } catch (err) {
      sendError(res, err, 'Failed to fetch users');
    }
  }

  async manualLogin(req, res) {
    try {
      const user = await authService.manualLogin(req.body);
      authService.establishSession(req, user);
      console.log('✅ Manual login successful for:', user.displayName, '(Role:', user.role, ')');
      res.json({
        success: true,
        user: {
          _id: user._id,
          displayName: user.displayName,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      sendError(res, err, 'Login failed');
    }
  }

  getCurrentUser(req, res) {
    console.log('Auth check - Is authenticated:', req.isAuthenticated());
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    return res.status(401).json({ error: 'Not authenticated' });
  }

  async setRole(req, res) {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      const user = await authService.setRole(req.user, req.body.role);
      req.user.role = user.role;
      console.log('✅ Role set for user:', user.displayName, 'Role:', user.role);
      res.json({ success: true, user });
    } catch (err) {
      sendError(res, err, 'Failed to set role');
    }
  }

  logout(req, res) {
    req.logout(() => {
      res.json({ message: 'Logged out' });
    });
  }

  authFailure(req, res) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = new AuthController();
