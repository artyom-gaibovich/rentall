

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('UserListingSteps', 'step4', {
      type: Sequelize.ENUM('inactive', 'active', 'completed'),
      defaultValue: 'active',
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('UserListingSteps', 'step4', {}),
  ]),
};
