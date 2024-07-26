

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Listing', 'reviewsCount', {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Listing', 'reviewsCount'),
  ]),
};
