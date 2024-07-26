

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Reviews', 'isAdminEnable', {
      type: Sequelize.INTEGER,
      defaultValue: true,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Reviews', 'isAdminEnable', {
      type: Sequelize.INTEGER,
      defaultValue: true,
    }),
  ]),
};
