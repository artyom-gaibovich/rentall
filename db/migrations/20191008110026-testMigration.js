

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('BlogDetails', 'isPrivate', {
    type: Sequelize.BOOLEAN,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('BlogDetails', 'isPrivate'),
};
