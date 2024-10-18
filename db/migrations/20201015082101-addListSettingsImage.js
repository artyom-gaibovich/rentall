

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('ListSettings', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('ListSettings', 'image'),
  ]),
};
