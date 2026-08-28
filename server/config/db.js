const { MongoClient, GridFSBucket } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';
const client = new MongoClient(uri, { useUnifiedTopology: true });

let dbInstance = null;
let collections = {};
let gridFSBucketInstance = null;

async function connectDB() {
  if (dbInstance) return dbInstance;
  try {
    await client.connect();
    dbInstance = client.db();
    
    // Initialize collections mapping
    collections.users = dbInstance.collection('users');
    collections.profiles = dbInstance.collection('profiles');
    collections.migrantRequests = dbInstance.collection('migrant_requests');
    collections.guideSessions = dbInstance.collection('guide_sessions');
    collections.messages = dbInstance.collection('messages');
    collections.documents = dbInstance.collection('documents');
    collections.reviews = dbInstance.collection('reviews');
    collections.notifications = dbInstance.collection('notifications');
    collections.scheduledCalls = dbInstance.collection('scheduled_calls');

    // Initialize GridFS Bucket
    gridFSBucketInstance = new GridFSBucket(dbInstance, { bucketName: 'uploads' });

    console.log('✅ Connected to MongoDB. Collections & GridFSBucket initialized.');
    return dbInstance;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
}

function getDB() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Please connect first.');
  }
  return dbInstance;
}

function getGridFSBucket() {
  if (!gridFSBucketInstance) {
    throw new Error('GridFS Bucket not initialized.');
  }
  return gridFSBucketInstance;
}

module.exports = {
  connectDB,
  getDB,
  getGridFSBucket,
  collections,
  client
};
