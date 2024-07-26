

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Reservation', 'bookingType', {
      type: Sequelize.STRING(20),
      allowNull: true,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Reservation', 'bookingType'),
  ]),
};
