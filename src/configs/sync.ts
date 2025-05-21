import connectToDB from './database';
import { defineUserModel } from '../models/usersModel';
import { defineVehicleModel } from '../models/vehiclesModel';

const syncDatabase = async () => {
  try {
    const sequelize = await connectToDB();

    defineUserModel(sequelize);

    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: true });

    console.log('Database synchronized');
  } catch (err) {
    console.error('Database sync failed:', err);
  }
};
export { syncDatabase };
