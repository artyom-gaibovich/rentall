

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Listing', 'thingsToDo', {
      type: Sequelize.TEXT('medium'),
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Listing', 'thingsToDo'),
  ]),
};
