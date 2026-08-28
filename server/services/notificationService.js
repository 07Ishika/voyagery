const notificationRepository = require('../repositories/notificationRepository');

class NotificationService {
  list(userId) {
    return notificationRepository.findByUserId(userId);
  }

  async markRead(notificationId) {
    const result = await notificationRepository.markRead(notificationId);
    return { success: true, result };
  }

  async create(body) {
    const notificationData = {
      ...body,
      createdAt: new Date(),
      read: false
    };
    const result = await notificationRepository.insertOne(notificationData);
    return { success: true, notificationId: result.insertedId };
  }
}

module.exports = new NotificationService();
