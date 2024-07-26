

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Reservation', 'checkInStart', {
      type: Sequelize.STRING(20),
      allowNull: false,
    }),
    queryInterface.addColumn('Reservation', 'checkInEnd', {
      type: Sequelize.STRING(20),
      allowNull: false,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Reservation', 'checkInStart'),
    queryInterface.removeColumn('Reservation', 'checkInEnd'),

  ]),
};
