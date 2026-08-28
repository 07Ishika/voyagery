const callRepository = require('../repositories/callRepository');
const notificationRepository = require('../repositories/notificationRepository');
const { AppError } = require('../utils/AppError');

class CallService {
  list(filters) {
    return callRepository.findFiltered(filters);
  }

  async create(body) {
    const callData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await callRepository.insertOne(callData);

    await notificationRepository.insertOne({
      userId: callData.migrantId,
      type: 'call_scheduled',
      title: 'Call Scheduled!',
      message: `Your call with ${callData.guideName} has been scheduled for ${callData.scheduledDate} at ${callData.scheduledTime}`,
      data: {
        callId: result.insertedId,
        guideId: callData.guideId,
        guideName: callData.guideName,
        scheduledDate: callData.scheduledDate,
        scheduledTime: callData.scheduledTime,
        meetingLink: callData.meetingLink
      },
      createdAt: new Date(),
      read: false
    });

    return { success: true, callId: result.insertedId, _id: result.insertedId };
  }

  async update(callId, body) {
    const updateData = { ...body, updatedAt: new Date() };
    const result = await callRepository.updateById(callId, updateData);
    const call = await callRepository.findById(callId);
    return { success: true, result, call };
  }

  async remove(callId) {
    const result = await callRepository.deleteById(callId);
    if (result.deletedCount === 0) {
      throw new AppError('Scheduled call not found', 404);
    }
    return { success: true, message: 'Scheduled call deleted successfully' };
  }
}

module.exports = new CallService();
