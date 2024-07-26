

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ReportUser', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reporterId: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.STRING,
    },
    reportType: {
      type: Sequelize.STRING,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('ReportUser'),
};
