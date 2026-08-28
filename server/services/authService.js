const userRepository = require('../repositories/userRepository');
const { createUserProfile } = require('../utils/createUserProfile');
const { AppError } = require('../utils/AppError');

class AuthService {
  async demoLogin({ userId, role }) {
    let user = null;

    if (userId) {
      user = await userRepository.findById(userId);
    } else if (role && ['migrant', 'guide'].includes(role)) {
      user = await userRepository.findByRole(role);
    } else {
      throw new AppError('userId or valid role (migrant/guide) required', 400);
    }

    if (!user) {
      throw new AppError(
        userId
          ? 'User not found'
          : `No ${role} user found in database. Run seed/create-test-users first.`,
        404
      );
    }

    return user;
  }

  async listDemoUsers() {
    return userRepository.listSummary();
  }

  async manualLogin({ email, name }) {
    if (!email && !name) {
      throw new AppError('Email or name required', 400);
    }

    const user = await userRepository.findByEmailOrName({ email, name });
    if (!user) {
      throw new AppError('User not found in database', 404);
    }

    if (user.role) {
      await createUserProfile(user, user.role);
    }

    return user;
  }

  async setRole(user, role) {
    if (!role || !['migrant', 'guide'].includes(role)) {
      throw new AppError('Valid role required (migrant or guide)', 400);
    }

    await userRepository.updateRole(user._id, role);
    await createUserProfile(user, role);

    return {
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      role
    };
  }

  establishSession(req, user) {
    const userIdString = user._id.toString();
    req.session.passport = { user: userIdString };
    req.user = user;
    return user;
  }
}

module.exports = new AuthService();
