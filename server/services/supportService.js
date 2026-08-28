const migrantRequestRepository = require('../repositories/migrantRequestRepository');
const messageRepository = require('../repositories/messageRepository');
const reviewRepository = require('../repositories/reviewRepository');

/** Secondary domains kept for REST completeness (YAGNI-friendly thin wrappers). */
class SupportService {
  listMigrantRequests(filters) {
    return migrantRequestRepository.findFiltered(filters);
  }

  async createMigrantRequest(body) {
    const requestData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending'
    };
    const result = await migrantRequestRepository.insertOne(requestData);
    return { success: true, requestId: result.insertedId };
  }

  async updateMigrantRequest(requestId, body) {
    const { status, guideId, ...rest } = body;
    const result = await migrantRequestRepository.updateById(requestId, {
      ...rest,
      status,
      guideId,
      updatedAt: new Date()
    });
    return { success: true, result };
  }

  listMessages(conversationId) {
    return messageRepository.findByConversation(conversationId);
  }

  async sendMessage(body) {
    const messageData = { ...body, createdAt: new Date(), read: false };
    const result = await messageRepository.insertOne(messageData);
    return { success: true, messageId: result.insertedId };
  }

  listReviews(guideId) {
    return reviewRepository.findByGuideId(guideId);
  }

  async createReview(body) {
    const reviewData = { ...body, createdAt: new Date() };
    const result = await reviewRepository.insertOne(reviewData);
    return { success: true, reviewId: result.insertedId };
  }
}

module.exports = new SupportService();
