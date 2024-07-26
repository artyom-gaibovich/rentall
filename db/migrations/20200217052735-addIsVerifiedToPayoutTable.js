

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Payout', 'isVerified', {
      type: Sequelize.BOOLEAN,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Payout', 'isVerified'),
  ]),
};
