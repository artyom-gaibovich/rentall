

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('User', 'userBanStatus', {
    type: Sequelize.BOOLEAN,
    defaultValue: 0,
  }),


  down: (queryInterface, Sequelize) => queryInterface.removeColumn('User', 'userBanStatus'),
};
