

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('WhyHostInfoBlock', 'value', {
      type: Sequelize.TEXT,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('WhyHostInfoBlock', 'value', {
      type: Sequelize.TEXT,
    }),
  ]),
};
