const profileRepository = require('../repositories/profileRepository');
const migrantRequestRepository = require('../repositories/migrantRequestRepository');
const sessionRepository = require('../repositories/sessionRepository');
const documentRepository = require('../repositories/documentRepository');
const reviewRepository = require('../repositories/reviewRepository');
const { AppError } = require('../utils/AppError');

class DashboardService {
  async getStats(userId) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new AppError('Profile not found', 404);

    if (profile.role === 'migrant') {
      const [requests, sessions, documents] = await Promise.all([
        migrantRequestRepository.countDocuments({ migrantId: userId }),
        sessionRepository.countDocuments({ migrantId: userId }),
        documentRepository.countDocuments({ userId })
      ]);
      return { requests, sessions, documents };
    }

    if (profile.role === 'guide') {
      const [sessions, reviews, clients] = await Promise.all([
        sessionRepository.countDocuments({ guideId: userId }),
        reviewRepository.countDocuments({ guideId: userId }),
        sessionRepository.distinct('migrantId', { guideId: userId })
      ]);
      return {
        sessions,
        reviews,
        clients: clients.length,
        rating: profile.rating || 0
      };
    }

    return {};
  }
}

module.exports = new DashboardService();
