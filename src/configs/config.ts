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
}

interface Config extends BaseConfig {
  database: DatabaseConfig;
}

type Environment = 'development' | 'production';

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
};

export const maxAge = {
  accessTokenMaxAge: process.env.ACCESS_TOKEN_MAX_AGE,
  refreshTokenMaxAge: process.env.REFRESH_TOKEN_MAX_AGE,
};

const envConfig: EnvConfig = {
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

const config: Config = {
  ...baseConfig,
  ...envConfig[environment],
};

export default config;
