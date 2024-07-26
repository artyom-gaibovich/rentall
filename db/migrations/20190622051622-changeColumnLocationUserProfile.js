

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('UserProfile', 'location', {
      type: Sequelize.TEXT,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('UserProfile', 'location', {
      type: Sequelize.TEXT,
    }),
  ]),
};
