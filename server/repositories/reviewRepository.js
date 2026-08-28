const { BaseRepository } = require('./BaseRepository');

class ReviewRepository extends BaseRepository {
  constructor() {
    super('reviews');
  }

  findByGuideId(guideId) {
    return this.find({ guideId }, { sort: { createdAt: -1 } });
  }
}

module.exports = new ReviewRepository();
