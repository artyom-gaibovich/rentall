

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('BedTypes', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    listId: {
      type: Sequelize.INTEGER,
    },
    bedCount: {
      type: Sequelize.INTEGER,
    },
    bedType: {
      type: Sequelize.INTEGER,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('BedTypes'),
};
