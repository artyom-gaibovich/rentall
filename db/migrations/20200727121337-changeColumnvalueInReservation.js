

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('Reservation', 'total', {
      type: Sequelize.FLOAT(9, 2),
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('Reservation', 'total', {
      type: Sequelize.FLOAT(9, 2),
    }),
  ]),
};
