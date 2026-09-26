const profileRepository = require('../repositories/profileRepository');
const sessionRepository = require('../repositories/sessionRepository');
const userRepository = require('../repositories/userRepository');

class PublicStatsService {
	async getStats() {
		const [guides, migrants, totalSessions, targetCountries] = await Promise.all([
			profileRepository.countDocuments({ role: 'guide' }),
			userRepository.countDocuments({ role: 'migrant' }),
			sessionRepository.countDocuments({}),
			profileRepository.distinct('targetCountries', { role: 'guide' })
		]);

		return {
			guides,
			migrants,
			consultationsBooked: totalSessions,
			successStories: totalSessions,
			countries: targetCountries.filter(Boolean).length
		};
	}
}

module.exports = new PublicStatsService();
