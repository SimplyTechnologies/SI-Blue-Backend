import { Sequelize } from 'sequelize';
import connectToDB from '../configs/database';
import { defineUserModel, User } from '../models/usersModel.js';
import { defineMakeModel, Make } from '../models/carMakesModel.js';
import { defineCarModel, CarModel } from '../models/carModelsModel.js';
import { defineCustomerModel, Customer } from '../models/customersModel.js';
import { defineVehicleModel, Vehicle } from '../models/vehiclesModel.js';
import { defineFavoriteModel, Favorite } from '../models/favorites.js';

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
    defineFavoriteModel(sequelize);

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

    Vehicle.hasMany(Customer, {
      foreignKey: 'vehicleId',
      as: 'customers',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Customer.belongsTo(Vehicle, {
      foreignKey: 'vehicleId',
      as: 'vehicle',
    });

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
      through: 'FavoriteVehicles',
      as: 'favoriteVehicles',
      foreignKey: 'userId',
      otherKey: 'vehicleId',
    });

    Vehicle.belongsToMany(User, {
      through: 'FavoriteVehicles',
      as: 'favoritedBy',
      foreignKey: 'vehicleId',
      otherKey: 'userId',
    });

    Favorite.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Favorite.belongsTo(Vehicle, {
      foreignKey: 'vehicleId',
      as: 'vehicle',
    });

    User.hasMany(Favorite, {
      foreignKey: 'userId',
      as: 'favorites',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Vehicle.hasMany(Favorite, {
      foreignKey: 'vehicleId',
      as: 'favorites',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    console.log('Creating tables...');
    try {
      await sequelize.sync({ alter: true });
      console.log('All tables have been successfully created or altered!');
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
