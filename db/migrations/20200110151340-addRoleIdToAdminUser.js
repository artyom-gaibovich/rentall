

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('AdminUser', 'roleId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('AdminUser', 'roleId'),
  ]),
};
