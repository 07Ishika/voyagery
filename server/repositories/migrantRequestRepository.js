const { ObjectId } = require('mongodb');
const { BaseRepository } = require('./BaseRepository');

class MigrantRequestRepository extends BaseRepository {
  constructor() {
    super('migrantRequests');
  }

  findFiltered({ status, specialization, limit = 20, skip = 0 } = {}) {
    const query = {};
    if (status) query.status = status;
    if (specialization) query.specialization = { $in: [specialization] };
    return this.find(query, {
      sort: { createdAt: -1 },
      limit: parseInt(limit, 10),
      skip: parseInt(skip, 10)
    });
  }

  updateById(requestId, updateData) {
    return this.updateOne({ _id: new ObjectId(requestId) }, { $set: updateData });
  }
}

module.exports = new MigrantRequestRepository();
