

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Threads', 'isRead', {
    type: Sequelize.BOOLEAN,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Threads', 'isRead'),
};
