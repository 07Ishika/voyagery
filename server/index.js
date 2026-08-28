/**
 * Server entry — connect DB, then listen.
 * Layered flow: routes → controllers → services → repositories → MongoDB
 */
require('dotenv').config();

const { createApp } = require('./app');
const { connectDB } = require('./config/db');

const port = process.env.PORT || 5000;

console.log('Environment variables loaded:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);

async function start() {
  await connectDB();
  const app = createApp();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
