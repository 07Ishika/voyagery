const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { ObjectId } = require('mongodb');
const { collections } = require('./db');
const { createUserProfile } = require('../utils/createUserProfile');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    if (!id || typeof id !== 'string' || (id.length !== 12 && id.length !== 24)) {
      return done(null, false);
    }

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (objectIdError) {
      return done(null, false);
    }

    const user = await collections.users.findOne({ _id: objectId });
    done(null, user);
  } catch (err) {
    console.error('Deserialize error:', err);
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
}, async function (req, accessToken, refreshToken, profile, done) {
  try {
    let user = await collections.users.findOne({ googleId: profile.id });
    const selectedRole = req.session.oauthRole;

    if (!user) {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
        photo: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        role: selectedRole || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await collections.users.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };

      if (selectedRole) {
        await createUserProfile(user, selectedRole);
      }
    } else if (!user.role && selectedRole) {
      await collections.users.updateOne(
        { googleId: profile.id },
        {
          $set: {
            role: selectedRole,
            updatedAt: new Date()
          }
        }
      );
      user.role = selectedRole;
      await createUserProfile(user, selectedRole);
    }

    req.session.oauthRole = undefined;
    done(null, user);
  } catch (err) {
    console.error('OAuth strategy error:', err);
    done(err, null);
  }
}));

module.exports = passport;
