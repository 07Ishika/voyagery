const { ObjectId } = require('mongodb');
const { BaseRepository } = require('./BaseRepository');

class SessionRepository extends BaseRepository {
  constructor() {
    super('guideSessions');
  }

  findFiltered(filters = {}) {
    const query = {};
    if (filters.guideId) query.guideId = filters.guideId;
    if (filters.migrantId) query.migrantId = filters.migrantId;
    if (filters.status) query.status = filters.status;
    if (filters.requestStatus) query.requestStatus = filters.requestStatus;
    if (filters.guideName) query.guideName = { $regex: filters.guideName, $options: 'i' };

    return this.find(query, { sort: { createdAt: -1 } });
  }

  findById(sessionId) {
    return this.findOne({ _id: new ObjectId(sessionId) });
  }

  updateById(sessionId, updateData) {
    return this.updateOne({ _id: new ObjectId(sessionId) }, { $set: updateData });
  }

  deleteById(sessionId) {
    return this.deleteOne({ _id: new ObjectId(sessionId) });
  }

  findUpdatedSince(guideId, lastUpdate) {
    const query = { guideId };
    if (lastUpdate) query.updatedAt = { $gt: new Date(lastUpdate) };
    return this.find(query, { sort: { updatedAt: -1 } });
  }
}

module.exports = new SessionRepository();
