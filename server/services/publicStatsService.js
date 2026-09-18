const profileRepository = require('../repositories/profileRepository');
const sessionRepository = require('../repositories/sessionRepository');
const userRepository = require('../repositories/userRepository');

class PublicStatsService {
	async getStats() {
		const [guides, migrants, successStories, targetCountries] = await Promise.all([
			profileRepository.countDocuments({ role: 'guide', verifiedStatus: 'verified' }),
			userRepository.countDocuments({ role: 'migrant' }),
			sessionRepository.countDocuments({
				$or: [{ status: 'completed' }, { requestStatus: 'completed' }]
			}),
			profileRepository.distinct('targetCountries', { role: 'guide' })
		]);

		return {
			guides,
			migrants,
			successStories,
			countries: targetCountries.filter(Boolean).length
		};
	}
}

module.exports = new PublicStatsService();
