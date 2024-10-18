

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Threads', 'messageUpdatedDate', {
      type: Sequelize.DATE,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Threads', 'messageUpdatedDate'),
  ]),
};
