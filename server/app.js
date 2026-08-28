/**
 * Express app factory — middleware + route mounting only.
 * Business logic lives in services; data access in repositories.
 */
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const documentRoutes = require('./routes/documentRoutes');
const callRoutes = require('./routes/callRoutes');
const aiRoutes = require('./routes/aiRoutes');
const apiRoutes = require('./routes/index');

function createApp() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const sessionSecret = process.env.SESSION_SECRET || (isProduction ? undefined : 'dev-session-secret-change-me');

  if (!sessionSecret) {
    throw new Error('SESSION_SECRET must be configured in production');
  }

  if (!process.env.SESSION_SECRET && !isProduction) {
    console.warn('Using a local fallback SESSION_SECRET for development. Set SESSION_SECRET in your environment for production-safe sessions.');
  }

  app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5000',
      process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true
  }));
  app.use(express.json());
  app.set('trust proxy', 1);

  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery',
      touchAfter: 24 * 3600
    }),
    cookie: {
      secure: isProduction,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax'
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport strategies (side-effect import)
  require('./config/passport');

  // REST mounts — URLs unchanged from previous monolith
  app.use('/auth', authRoutes);
  app.use('/api', profileRoutes);
  app.use('/api', sessionRoutes);
  app.use('/api', documentRoutes);
  app.use('/api', callRoutes);
  app.use('/api', aiRoutes);
  app.use('/api', apiRoutes);

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
