'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
   
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true, 
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};