const { ObjectId } = require('mongodb');
const { BaseRepository } = require('./BaseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  findById(id) {
    return this.findOne({ _id: new ObjectId(id) });
  }

  findByRole(role) {
    return this.findOne({ role });
  }

  findByEmailOrName({ email, name }) {
    if (email) {
      return this.findOne({ email: { $regex: email, $options: 'i' } });
    }
    if (name) {
      return this.findOne({ displayName: { $regex: name, $options: 'i' } });
    }
    return null;
  }

  listSummary() {
    return this.find({}).then((users) =>
      users.map((user) => ({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role
      }))
    );
  }

  updateRole(userId, role) {
    return this.updateOne(
      { _id: userId },
      { $set: { role, updatedAt: new Date() } }
    );
  }
}

module.exports = new UserRepository();
