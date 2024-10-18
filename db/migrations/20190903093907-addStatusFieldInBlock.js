

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('StaticInfoBlock', 'isEnable', {
      type: Sequelize.BOOLEAN,
      defaultValue: 1,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('StaticInfoBlock', 'isEnable', {
      type: Sequelize.STRING,
    }),
  ]),
};
