const { ObjectId } = require('mongodb');
const { BaseRepository } = require('./BaseRepository');

class NotificationRepository extends BaseRepository {
  constructor() {
    super('notifications');
  }

  findByUserId(userId) {
    return this.find({ userId }, { sort: { createdAt: -1 } });
  }

  markRead(notificationId) {
    return this.updateOne(
      { _id: new ObjectId(notificationId) },
      { $set: { read: true, readAt: new Date() } }
    );
  }
}

module.exports = new NotificationRepository();
