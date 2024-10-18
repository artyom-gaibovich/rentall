

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `details`='Add your bank details' WHERE `id`='2';"),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query("UPDATE `PaymentMethods` SET `details`='Add your bank details' WHERE `id`='2';"),
  ]),
};
