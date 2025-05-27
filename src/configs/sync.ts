import { Sequelize } from 'sequelize';
import connectToDB from '../configs/database';
import { defineUserModel, User } from '../models/usersModel.js';
import { defineMakeModel, Make } from '../models/carMakesModel.js';
import { defineCarModel, CarModel } from '../models/carModelsModel.js';
import { defineCustomerModel, Customer } from '../models/customersModel.js';
import { defineVehicleModel, Vehicle } from '../models/vehiclesModel.js';

const syncDatabase = async (): Promise<Sequelize> => {
  try {
    console.log('Starting database initialization...');
    const sequelize = await connectToDB();

    if (!sequelize) {
      throw new Error('Sequelize instance is undefined');
    }

    console.log('Initializing models...');

    defineMakeModel(sequelize);
    defineCarModel(sequelize);
    defineUserModel(sequelize);
    defineVehicleModel(sequelize);
    defineCustomerModel(sequelize);

    console.log('Setting up associations...');

    Make.hasMany(CarModel, {
      foreignKey: 'makeId',
      as: 'models',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    CarModel.belongsTo(Make, {
      foreignKey: 'makeId',
      as: 'make',
    });
    Vehicle.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

    Customer.hasMany(Vehicle, { foreignKey: 'customerId', as: 'vehicles' });

    CarModel.hasMany(Vehicle, {
      foreignKey: 'modelId',
      as: 'vehicles',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Vehicle.belongsTo(CarModel, {
      foreignKey: 'modelId',
      as: 'model',
    });
    User.belongsToMany(Vehicle, {
      through: 'favorites',
      foreignKey: 'userId',
      otherKey: 'vehicleId',
      as: 'favoriteVehicles',
    });

    Vehicle.belongsToMany(User, {
      through: 'favorites',
      foreignKey: 'vehicleId',
      otherKey: 'userId',
      as: 'favoriteByUsers',
    });

    console.log('Creating tables...');
    try {
      await sequelize.sync({ alter: true });
      console.log('All tables have been successfully created or altered!');
      if (process.env.NODE_ENV === 'development') {
        await sequelize.query(`
          SELECT setval(
            pg_get_serial_sequence('vehicles', 'id'),
            COALESCE((SELECT MAX(id) FROM vehicles), 1),
            true
          );
        `);
        console.log('Vehicle ID sequence has been synchronized');
      }
    } catch (syncError: any) {
      console.error('Error during sync:', syncError);
      throw syncError;
    }

    return sequelize;
  } catch (error: any) {
    console.error('Error initializing models:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};

export { syncDatabase };

