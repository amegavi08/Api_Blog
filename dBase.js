const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a new Sequelize instance using environment variables
const sequelize = new Sequelize(
  process.env.DEV_DB_NAME,
  process.env.DEV_DB_USER, 
  String(process.env.DEV_DB_PASS),
  {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 5,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    }
  }
);

// Test database connection
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    
  }
}

// Run the test
testDatabaseConnection();

module.exports = sequelize;