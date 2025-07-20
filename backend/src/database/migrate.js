const fs = require('fs');
const path = require('path');
const { query, testConnection, closePool } = require('./connection');

const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migration...');
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Could not connect to database');
    }
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Running database schema...');
    await query(schemaSQL);
    console.log('✅ Schema created successfully');
    
    // Read seeds file
    const seedsPath = path.join(__dirname, 'seeds.sql');
    const seedsSQL = fs.readFileSync(seedsPath, 'utf8');
    
    console.log('🌱 Running database seeds...');
    await query(seedsSQL);
    console.log('✅ Seeds inserted successfully');
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await closePool();
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations }; 