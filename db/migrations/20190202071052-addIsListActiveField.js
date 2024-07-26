

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('WishList', 'isListActive', {
    type: Sequelize.BOOLEAN,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('WishList', 'isListActive'),
};
