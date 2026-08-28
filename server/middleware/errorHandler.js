/**
 * Centralized error handler — keeps response shape consistent with existing API.
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
