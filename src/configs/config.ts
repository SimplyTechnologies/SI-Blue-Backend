import dotenv from 'dotenv';
dotenv.config();

interface DatabaseConfig {
  host: string | undefined;
  port: string | number | undefined;
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  logging?: boolean;
}

interface EnvConfig {
  development: {
    database: DatabaseConfig;
  };
  production: {
    database: DatabaseConfig;
  };
}

interface BaseConfig {
  port: string | number;
  jwt: {
    secret: string | undefined;
  };
  frontendUrl: string | undefined;
}

interface Config extends BaseConfig {
  database: DatabaseConfig;
}

type Environment = 'development' | 'production';
export const productInfo = process.env.PRODUCT_NAME

const isValidEnvironment = (env: string): env is Environment => {
  return env === 'development' || env === 'production';
};

const ENV = process.env.NODE_ENV || 'development';

const environment: Environment = isValidEnvironment(ENV) ? ENV : 'development';

const baseConfig = {
  port: process.env.PORT || 3001,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  frontendUrl: process.env.FRONTEND_URL,
};

const envConfig: EnvConfig = {
  development: {
    database: {
      host: process.env.HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'vehicle_admin',
      password: process.env.DB_PASSWORD || 'vehicle',
      database: process.env.DB_NAME || 'vehicle_management_system',
    },
  },
  production: {
    database: {
      host: process.env.HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: false,
    },
  },
};

const config: Config = {
  ...baseConfig,
  ...envConfig[environment],
};


export default config;
