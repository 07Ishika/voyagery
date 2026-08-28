const profileRepository = require('../repositories/profileRepository');
const documentRepository = require('../repositories/documentRepository');
const { AppError } = require('../utils/AppError');

class ProfileService {
  async getProfileWithDocuments(userId) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    profile.documents = await documentRepository.findByUserId(userId);
    return profile;
  }

  async saveProfile(body) {
    const { userId, ...profileData } = body;
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    const updateData = { ...profileData, updatedAt: new Date() };
    const existing = await profileRepository.findByUserId(userId);
    if (!existing) updateData.createdAt = new Date();

    const result = await profileRepository.upsertByUserId(userId, updateData);
    const updatedProfile = await profileRepository.findByUserId(userId);
    updatedProfile.documents = await documentRepository.findByUserId(userId);

    return {
      success: true,
      profile: updatedProfile,
      upserted: result.upsertedCount > 0,
      modified: result.modifiedCount > 0
    };
  }

  async updateVerification(userId, { status, notes }) {
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      throw new AppError('Invalid verification status', 400);
    }

    const result = await profileRepository.updateByUserId(userId, {
      verificationStatus: status,
      verificationNotes: notes || '',
      verificationUpdatedAt: new Date()
    });

    if (result.matchedCount === 0) {
      throw new AppError('Profile not found', 404);
    }

    return { success: true, message: 'Verification status updated' };
  }

  async createGuideProfile(body) {
    const { userId, fullName, email, specialization, residenceCountry, hourlyRate } = body;

    const guideProfile = {
      userId,
      fullName,
      email,
      role: 'guide',
      specialization: specialization || 'General Consultation',
      residenceCountry: residenceCountry || 'Canada',
      targetCountries: [residenceCountry || 'Canada'],
      expertiseAreas: ['Immigration', 'Visa Process'],
      rating: 4.5,
      totalReviews: 0,
      hourlyRate: hourlyRate || 50,
      languages: ['English'],
      yearsExperience: '5+ years',
      availability: 'Available',
      verifiedStatus: 'verified',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await profileRepository.insertOne(guideProfile);
    return { success: true, profileId: result.insertedId, profile: guideProfile };
  }

  searchGuides(filters) {
    return profileRepository.searchGuides(filters);
  }
}

module.exports = new ProfileService();
