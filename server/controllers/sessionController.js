const sessionService = require('../services/sessionService');
const { sendError } = require('../utils/sendError');

class SessionController {
  async list(req, res) {
    try {
      const sessions = await sessionService.list(req.query);
      res.json(sessions);
    } catch (err) {
      sendError(res, err, 'Failed to fetch guide sessions');
    }
  }

  async create(req, res) {
    try {
      const result = await sessionService.create(req.body);
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to create guide session');
    }
  }

  async update(req, res) {
    try {
      const result = await sessionService.update(req.params.sessionId, req.body);
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to update guide session');
    }
  }

  async getById(req, res) {
    try {
      const session = await sessionService.getById(req.params.sessionId);
      res.json(session);
    } catch (err) {
      sendError(res, err, 'Failed to fetch session');
    }
  }

  async remove(req, res) {
    try {
      const result = await sessionService.remove(req.params.sessionId);
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to delete session');
    }
  }

  async realtime(req, res) {
    try {
      const result = await sessionService.realtime(req.params.guideId, req.query.lastUpdate);
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to fetch real-time sessions');
    }
  }
}

module.exports = new SessionController();
