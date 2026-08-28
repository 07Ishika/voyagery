const { AppError } = require('../utils/AppError');

function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return next(new AppError('Authentication required', 401));
}

function requireSelf(req, res, next) {
  const requestedUserId = req.params.userId || req.body?.userId || req.query.userId;
  const authenticatedUserId = req.user?._id?.toString();

  if (requestedUserId && requestedUserId.toString() !== authenticatedUserId) {
    return next(new AppError('You may only access your own resources', 403));
  }

  next();
}

module.exports = { requireAuth, requireSelf };