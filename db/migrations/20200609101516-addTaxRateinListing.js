

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Reservation', 'taxRate', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    }),
    queryInterface.addColumn('ListingData', 'taxRate', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Reservation', 'taxRate'),
    queryInterface.removeColumn('ListingData', 'taxRate'),
  ]),
};
