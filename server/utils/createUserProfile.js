const { collections } = require('../config/db');

/**
 * Create a role-specific profile if one does not already exist.
 * Shared by OAuth and manual auth flows.
 */
async function createUserProfile(user, role) {
  try {
    const existingProfile = await collections.profiles.findOne({ userId: user._id.toString() });
    if (existingProfile) {
      console.log('Profile already exists for user:', user.displayName);
      return;
    }

    const baseProfile = {
      userId: user._id.toString(),
      fullName: user.displayName,
      email: user.email,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let profileData;
    if (role === 'guide') {
      profileData = {
        ...baseProfile,
        specialization: ['General Consultation'],
        residenceCountry: 'Canada',
        targetCountries: ['Canada'],
        expertiseAreas: ['Immigration', 'Visa Process'],
        rating: 4.5,
        totalReviews: 0,
        hourlyRate: 50,
        languages: ['English'],
        yearsExperience: '2+ years',
        availability: 'Available',
        verifiedStatus: 'pending',
        bio: 'Experienced guide ready to help with your immigration journey.'
      };
    } else {
      profileData = {
        ...baseProfile,
        currentCountry: 'India',
        targetCountries: ['Canada'],
        profession: 'Professional',
        experience: '3+ years',
        education: 'Bachelor\'s Degree',
        languages: ['English'],
        immigrationGoals: ['Permanent Residence'],
        timeline: '6-12 months',
        budget: '$50-80 per session'
      };
    }

    await collections.profiles.insertOne(profileData);
    console.log(`✅ Created ${role} profile for:`, user.displayName);
  } catch (error) {
    console.error('Error creating profile:', error);
  }
}

module.exports = { createUserProfile };
