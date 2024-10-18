'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Listing', 'sourceUrl', {
        type: Sequelize.STRING(250),
        allowNull: true,
        defaultValue: null
      }),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Listing', 'sourceUrl'),
    ])
  }
};
