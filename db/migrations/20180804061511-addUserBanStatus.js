

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('User', 'userBanStatus', {
    type: Sequelize.BOOLEAN,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('User', 'userBanStatus'),
};
