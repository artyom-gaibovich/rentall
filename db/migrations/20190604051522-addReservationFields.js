

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Reservation', 'isSpecialPriceAverage', {
      type: Sequelize.FLOAT,
    }),
    queryInterface.addColumn('Reservation', 'dayDifference', {
      type: Sequelize.FLOAT,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Reservation', 'isSpecialPriceAverage'),
    queryInterface.removeColumn('Reservation', 'dayDifference'),
  ]),
};
