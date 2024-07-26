

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query("UPDATE `Country` SET `dialCode`='+357' WHERE `countryCode`='CY'"),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query("UPDATE `Country` SET `dialCode`='+357' WHERE `countryCode`='CY'"),
  ]),
};
