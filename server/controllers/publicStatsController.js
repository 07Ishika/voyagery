const publicStatsService = require('../services/publicStatsService');
const { sendError } = require('../utils/sendError');

class PublicStatsController {
  async getStats(req, res) {
    try {
      res.json(await publicStatsService.getStats());
    } catch (err) {
      sendError(res, err, 'Failed to fetch public statistics');
    }
  }
}

module.exports = new PublicStatsController();