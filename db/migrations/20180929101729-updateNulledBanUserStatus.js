

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('UPDATE User SET userBanStatus=0 WHERE userBanStatus IS NULL'),

  down: (queryInterface, Sequelize) => queryInterface.sequelize.query('UPDATE User SET userBanStatus=NULL WHERE userBanStatus=0'),
};
