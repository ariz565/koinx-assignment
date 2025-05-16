require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Test MongoDB connection
async function testConnection() {
  try {
    await connectDB();
    console.log('MongoDB connection successful!');
    
    // Get list of collections to verify database access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Create a test document to verify write access
    const testSchema = new mongoose.Schema({ name: String, testDate: { type: Date, default: Date.now } });
    const TestModel = mongoose.models.Test || mongoose.model('Test', testSchema);
    
    await TestModel.create({ name: 'connection_test' });
    console.log('Successfully wrote test document to database');
    
    // Read the test document to verify read access
    const results = await TestModel.findOne({ name: 'connection_test' });
    console.log('Successfully read from database:', results);
    
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  }
}

// Run the test
testConnection();