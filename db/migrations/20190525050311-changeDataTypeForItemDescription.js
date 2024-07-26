

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('ListSettings', 'itemDescription', {
      type: Sequelize.TEXT,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('ListSettings', 'itemDescription'),
  ]),
};
