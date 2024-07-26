

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('ThreadItems', 'isApproved', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('ThreadItems', 'isApproved'),
  ]),
};
