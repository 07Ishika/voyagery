const notificationService = require('../services/notificationService');
const dashboardService = require('../services/dashboardService');
const supportService = require('../services/supportService');
const { sendError } = require('../utils/sendError');

class NotificationController {
  async list(req, res) {
    try {
      res.json(await notificationService.list(req.params.userId));
    } catch (err) {
      sendError(res, err, 'Failed to fetch notifications');
    }
  }

  async markRead(req, res) {
    try {
      res.json(await notificationService.markRead(req.params.notificationId));
    } catch (err) {
      sendError(res, err, 'Failed to mark notification as read');
    }
  }

  async create(req, res) {
    try {
      res.json(await notificationService.create(req.body));
    } catch (err) {
      sendError(res, err, 'Failed to create notification');
    }
  }
}

class DashboardController {
  async getStats(req, res) {
    try {
      res.json(await dashboardService.getStats(req.params.userId));
    } catch (err) {
      sendError(res, err, 'Failed to fetch dashboard stats');
    }
  }
}

class SupportController {
  async listMigrantRequests(req, res) {
    try {
      res.json(await supportService.listMigrantRequests(req.query));
    } catch (err) {
      sendError(res, err, 'Failed to fetch migrant requests');
    }
  }

  async createMigrantRequest(req, res) {
    try {
      res.json(await supportService.createMigrantRequest(req.body));
    } catch (err) {
      sendError(res, err, 'Failed to create migrant request');
    }
  }

  async updateMigrantRequest(req, res) {
    try {
      res.json(await supportService.updateMigrantRequest(req.params.requestId, req.body));
    } catch (err) {
      sendError(res, err, 'Failed to update migrant request');
    }
  }

  async listMessages(req, res) {
    try {
      res.json(await supportService.listMessages(req.params.conversationId));
    } catch (err) {
      sendError(res, err, 'Failed to fetch messages');
    }
  }

  async sendMessage(req, res) {
    try {
      res.json(await supportService.sendMessage(req.body));
    } catch (err) {
      sendError(res, err, 'Failed to send message');
    }
  }

  async listReviews(req, res) {
    try {
      res.json(await supportService.listReviews(req.params.guideId));
    } catch (err) {
      sendError(res, err, 'Failed to fetch reviews');
    }
  }

  async createReview(req, res) {
    try {
      res.json(await supportService.createReview(req.body));
    } catch (err) {
      sendError(res, err, 'Failed to create review');
    }
  }
}

module.exports = {
  notificationController: new NotificationController(),
  dashboardController: new DashboardController(),
  supportController: new SupportController()
};
