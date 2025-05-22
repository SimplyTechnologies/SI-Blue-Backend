const initModels = async () => {
    // console.log('Starting database initialization...');
    // const sequelize = await connectToDB();
    // User.initModel(sequelize)
    //   if (!sequelize) {
    //     throw new Error('Sequelize instance is undefined');
    //   }
    //   console.log('Initializing models...');
    //   const makeModel = Make.initModel(sequelize);
    //   const carModelModel = CarModel.initModel(sequelize);
    //   const customerModel = Customer.initModel(sequelize);
    //    User.initModel(sequelize);
    //   const vehicleModel = Vehicle.initModel(sequelize);
    //   console.log('Setting up associations...');
    //   Make.hasMany(CarModel, { foreignKey: 'makeId', as: 'models' });
    //   CarModel.belongsTo(Make, { foreignKey: 'makeId', as: 'make' });
    //   User.hasMany(Vehicle, { foreignKey: 'userId', as: 'vehicles' });
    //   Vehicle.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
    //   Customer.hasMany(Vehicle, { foreignKey: 'customerId', as: 'vehicles' });
    //   Vehicle.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
    //   CarModel.hasMany(Vehicle, { foreignKey: 'modelId', as: 'vehicles' });
    //   Vehicle.belongsTo(CarModel, { foreignKey: 'modelId', as: 'model' });
    //   console.log('Creating tables...');
    //   try {
    //     await sequelize.sync({ alter: true, logging: console.log });
    //     console.log('All tables have been successfully created!');
    //   } catch (syncError) {
    //     console.error('Error during sync:', syncError);
    //     throw syncError;
    //   }
    //   return sequelize;
    // } catch (error) {
    //   console.error('Error initializing models:', error.message);
    //   console.error('Stack trace:', error.stack);
    //   throw error;
    // }
};
export { initModels };
//# sourceMappingURL=index.js.map