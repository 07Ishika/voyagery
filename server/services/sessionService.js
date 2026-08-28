const sessionRepository = require('../repositories/sessionRepository');
const { AppError } = require('../utils/AppError');

class SessionService {
  list(filters) {
    return sessionRepository.findFiltered(filters);
  }

  async create(body) {
    const sessionData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'scheduled'
    };
    const result = await sessionRepository.insertOne(sessionData);
    return { success: true, sessionId: result.insertedId };
  }

  async update(sessionId, body) {
    const updateData = { ...body, updatedAt: new Date() };
    const result = await sessionRepository.updateById(sessionId, updateData);
    const session = await sessionRepository.findById(sessionId);
    return { success: true, result, session };
  }

  async getById(sessionId) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new AppError('Session not found', 404);
    return session;
  }

  async remove(sessionId) {
    const result = await sessionRepository.deleteById(sessionId);
    if (result.deletedCount === 0) throw new AppError('Session not found', 404);
    return { success: true, message: 'Session deleted successfully' };
  }

  async realtime(guideId, lastUpdate) {
    const sessions = await sessionRepository.findUpdatedSince(guideId, lastUpdate);
    return { sessions, timestamp: new Date().toISOString() };
  }
}

module.exports = new SessionService();
