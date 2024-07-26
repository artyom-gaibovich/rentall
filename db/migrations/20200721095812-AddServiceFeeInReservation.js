

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Reservation', 'hostServiceFeeType', {
      type: Sequelize.STRING,
      allowNull: false,
    }),
    queryInterface.addColumn('Reservation', 'hostServiceFeeValue', {
      type: Sequelize.FLOAT,
      allowNull: false,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Reservation', 'hostServiceFeeType'),
    queryInterface.removeColumn('Reservation', 'hostServiceFeeValue'),
  ]),
};
