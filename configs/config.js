require('dotenv').config();

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  port: process.env.PORT || 3001,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

const envConfig = {
  development: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'vehicle_admin',
      password: process.env.DB_PASSWORD || 'vehicle',
      database: process.env.DB_NAME || 'vehicle_management_system',
    },
  },
  production: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: false,
    },
  },
};

module.exports = { ...baseConfig, ...envConfig[ENV] };
