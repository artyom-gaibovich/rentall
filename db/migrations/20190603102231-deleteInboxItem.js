

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query('DELETE FROM ThreadItems WHERE id=58;'),
    queryInterface.sequelize.query('DELETE FROM Threads WHERE id=18;'),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
  ]),
};
