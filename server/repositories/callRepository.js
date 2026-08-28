const { ObjectId } = require('mongodb');
const { BaseRepository } = require('./BaseRepository');

class CallRepository extends BaseRepository {
  constructor() {
    super('scheduledCalls');
  }

  findFiltered(filters = {}) {
    const query = {};
    if (filters.guideId) query.guideId = filters.guideId;
    if (filters.migrantId) query.migrantId = filters.migrantId;
    if (filters.status) query.status = filters.status;
    return this.find(query, { sort: { scheduledDate: 1, scheduledTime: 1 } });
  }

  findById(callId) {
    return this.findOne({ _id: new ObjectId(callId) });
  }

  updateById(callId, updateData) {
    return this.updateOne({ _id: new ObjectId(callId) }, { $set: updateData });
  }

  deleteById(callId) {
    return this.deleteOne({ _id: new ObjectId(callId) });
  }
}

module.exports = new CallRepository();
