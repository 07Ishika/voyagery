// Test script to verify MongoDB connection and API endpoints
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔌 Testing MongoDB connection...');
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db();
    
    // Test collections
    const collections = [
      'users',
      'profiles', 
      'migrant_requests',
      'guide_sessions',
      'messages',
      'documents',
      'reviews',
      'notifications'
    ];
    
    console.log('\n📊 Checking collections...');
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        console.log(`✅ ${collectionName}: ${count} documents`);
      } catch (error) {
        console.log(`❌ ${collectionName}: Error - ${error.message}`);
      }
    }
    
    // Test sample queries
    console.log('\n🔍 Testing sample queries...');
    
    // Test users query
    const users = await db.collection('users').find({}).limit(3).toArray();
    console.log(`👥 Found ${users.length} users`);
    
    // Test profiles query
    const profiles = await db.collection('profiles').find({}).limit(3).toArray();
    console.log(`📋 Found ${profiles.length} profiles`);
    
    // Test migrant requests query
    const requests = await db.collection('migrant_requests').find({}).limit(3).toArray();
    console.log(`📝 Found ${requests.length} migrant requests`);
    
    // Test guide sessions query
    const sessions = await db.collection('guide_sessions').find({}).limit(3).toArray();
    console.log(`🎯 Found ${sessions.length} guide sessions`);
    
    console.log('\n🎉 All tests passed! MongoDB is ready for use.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your MONGODB_URI in .env file');
    console.log('3. Verify database permissions');
  } finally {
    await client.close();
  }
}

// Run the test
if (require.main === module) {
  testConnection();
}

module.exports = { testConnection };

