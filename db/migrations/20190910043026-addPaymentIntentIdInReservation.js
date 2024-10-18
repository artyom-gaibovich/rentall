

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Reservation', 'paymentIntentId', {
      type: Sequelize.STRING,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Reservation', 'paymentIntentId', {
      type: Sequelize.STRING,
    }),
  ]),
};
