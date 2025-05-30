require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'vehicle_admin',
    password: process.env.DB_PASSWORD || 'vehicle',
    database: process.env.DB_NAME || 'vehicle_management_system',
    host: process.env.HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
  },
  production: {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
    logging: false,
  },
};
