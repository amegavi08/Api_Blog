// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const PG_USERNAME = process.env.DEV_DB_USER;
const PG_PASSWORD = process.env.DEV_DB_PASS;
const PG_HOST = process.env.DEV_DB_HOST;
const PG_DEV_DATABASE = process.env.DEV_DB_NAME;
const PG_PROD_DATABASE = process.env.DEV_DB_NAME;
module.exports = {
  development: {
    username: `${PG_USERNAME}`,
    password: `${PG_PASSWORD}`,
    port: 5432,
    database: PG_DEV_DATABASE,
    host: PG_HOST,
    dialect: 'postgres',
    distinct: true,
    pool: { max: 100, min: 0, idle: 200000, acquire: 1000000 },
    dialectOptions: { idle_in_transaction_session_timeout: 5000 }
  },

  production: {
    username: PG_USERNAME,
    password: PG_PASSWORD,
    port: 5432,
    database: PG_PROD_DATABASE,
    host: PG_HOST,
    dialect: 'postgres',
    distinct: true,
    pool: { max: 100, min: 0, idle: 200000, acquire: 1000000 },
    dialectOptions: { idle_in_transaction_session_timeout: 5000 }
  },
  migrationStorageTableName: 'sequelize_meta',
};
