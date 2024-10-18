

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query('UPDATE `Cancellation` SET `nonRefundableNightsBeforeCheckIn`= 0 WHERE `id`= 3'),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query('UPDATE `Cancellation` SET `nonRefundableNightsBeforeCheckIn`= 0 WHERE `id`= 3'),
  ]),
};
