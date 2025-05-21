import connectToDB from './database';
import { defineUserModel } from '../models/usersModel';
import { defineVehicleModel } from '../models/vehiclesModel';
import {defineMakeModel} from '../models/carMakesModel'
import { defineCarModel } from '../models/carModelsModel'
import { defineCustomerModel } from '../models/customersModel';

const syncDatabase = async () => {
  try {
    const sequelize = await connectToDB();

    defineUserModel(sequelize);
    defineVehicleModel(sequelize);
    defineMakeModel(sequelize);
    defineCarModel(sequelize);
    defineCustomerModel(sequelize);

    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: true });

    console.log('Database synchronized');
  } catch (err) {
    console.error('Database sync failed:', err);
  }
};
export { syncDatabase };
