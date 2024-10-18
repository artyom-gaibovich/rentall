

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('UPDATE PaymentMethods SET processedIn="5–7 business days" WHERE id=2'),

  down: (queryInterface, Sequelize) => queryInterface.sequelize.query('UPDATE PaymentMethods SET processedIn="5 to 7 business days" WHERE id=2'),
};
