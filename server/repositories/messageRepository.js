const { BaseRepository } = require('./BaseRepository');

class MessageRepository extends BaseRepository {
  constructor() {
    super('messages');
  }

  findByConversation(conversationId) {
    return this.find({ conversationId }, { sort: { createdAt: 1 } });
  }
}

module.exports = new MessageRepository();
