

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('ListSettings', 'itemDescription', {
      type: Sequelize.STRING,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('ListSettings', 'itemDescription'),
  ]),
};
