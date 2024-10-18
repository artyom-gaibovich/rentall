

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('User', 'userDeletedAt', {
    type: Sequelize.DATE,
    defaultValue: null,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('User', 'userDeletedAt'),
};
