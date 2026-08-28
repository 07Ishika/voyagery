const profileService = require('../services/profileService');
const { sendError } = require('../utils/sendError');

class ProfileController {
  async getProfile(req, res) {
    try {
      const profile = await profileService.getProfileWithDocuments(req.params.userId);
      res.json(profile);
    } catch (err) {
      sendError(res, err, 'Failed to fetch profile');
    }
  }

  async saveProfile(req, res) {
    try {
      const result = await profileService.saveProfile({
        ...req.body,
        userId: req.user._id.toString()
      });
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to save profile');
    }
  }

  async updateVerification(req, res) {
    try {
      const result = await profileService.updateVerification(req.params.userId, req.body);
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to update verification status');
    }
  }

  async createGuideProfile(req, res) {
    try {
      const result = await profileService.createGuideProfile(req.body);
      res.json(result);
    } catch (err) {
      sendError(res, err, 'Failed to create guide profile');
    }
  }

  async searchGuides(req, res) {
    try {
      const guides = await profileService.searchGuides(req.query);
      res.json(guides);
    } catch (err) {
      sendError(res, err, 'Failed to search guides');
    }
  }
}

module.exports = new ProfileController();
