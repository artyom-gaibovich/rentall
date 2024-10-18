

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('UserProfile', 'countryName', {
      type: Sequelize.STRING,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('UserProfile', 'countryName', {
      type: Sequelize.STRING,
    }),
  ]),
};
