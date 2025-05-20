import { Sequelize } from 'sequelize';
import config from './config';

const sequelizeRoot = new Sequelize(
  process.env.DEFAULT_DB as string,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    logging: false,
    dialect: 'postgres',
  },
);
console.log(sequelizeRoot)

const ensureDatabaseExists = async () => {
  try {
    const [result] = await sequelizeRoot.query(
      `SELECT datname FROM pg_database WHERE datname = '${process.env.DB_NAME}'`,
    );
   
    if (result.length == 0) {
      await sequelizeRoot.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`DATABASE ${process.env.DB_NAME} CREATED...`);
    } else {
      console.log(`DATABASE ${process.env.DB_NAME} already exists`);
    }
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

const connectToDB = async () => {
  await ensureDatabaseExists();

  const sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    logging: false,
    dialect: 'postgres',
  });

  try {
    await sequelize.authenticate();
    console.log(`Connected to db ${process.env.DB_NAME}`);
  } catch (err) {
    console.log(err.message);
    console.log(`Error while connecting db...`);
    process.exit(1);
  }

  return sequelize;
};

export default connectToDB;
