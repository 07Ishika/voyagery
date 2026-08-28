const { BaseRepository } = require('./BaseRepository');

class ProfileRepository extends BaseRepository {
  constructor() {
    super('profiles');
  }

  findByUserId(userId) {
    return this.findOne({ userId });
  }

  upsertByUserId(userId, updateData) {
    return this.updateOne({ userId }, { $set: updateData }, { upsert: true });
  }

  updateByUserId(userId, updateData) {
    return this.updateOne({ userId }, { $set: updateData });
  }

  searchGuides({ specialization, country, rating, limit = 20, skip = 0 }) {
    const query = { role: 'guide' };
    if (specialization) query.specialization = { $in: [specialization] };
    if (country) query.targetCountries = { $in: [country] };
    if (rating) query.rating = { $gte: parseFloat(rating) };

    return this.find(query, {
      limit: parseInt(limit, 10),
      skip: parseInt(skip, 10)
    });
  }
}

module.exports = new ProfileRepository();
