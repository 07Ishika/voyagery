const callService = require('../services/callService');
const { sendError } = require('../utils/sendError');

class CallController {
  async list(req, res) {
    try {
      const calls = await callService.list(req.query);
      res.json(calls);
    } catch (err) {
      sendError(res, err, 'Failed to fetch scheduled calls');
    }
  }

  async create(req, res) {
    try {
      const result = await callService.create(req.body);
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to create scheduled call');
    }
  }

  async update(req, res) {
    try {
      const result = await callService.update(req.params.callId, req.body);
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to update scheduled call');
    }
  }

  async remove(req, res) {
    try {
      const result = await callService.remove(req.params.callId);
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to delete scheduled call');
    }
  }
}

module.exports = new CallController();
