const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('blog','postgres','Kings', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testDatabaseConnection();


