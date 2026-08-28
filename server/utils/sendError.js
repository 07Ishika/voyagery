/**
 * Maps AppError / unexpected errors to consistent JSON responses.
 * Controllers stay thin — they only call services.
 */
function sendError(res, err, fallbackMessage) {
  if (err.status || err.statusCode) {
    return res.status(err.status || err.statusCode).json({ error: err.message });
  }
  console.error(fallbackMessage, err);
  return res.status(500).json({ error: fallbackMessage });
}

module.exports = { sendError };
