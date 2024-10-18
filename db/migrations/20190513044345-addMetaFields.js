

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('StaticPage', 'metaTitle', {
      type: Sequelize.STRING,
    }),
    queryInterface.addColumn('StaticPage', 'metaDescription', {
      type: Sequelize.TEXT,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('StaticPage', 'metaTitle'),
    queryInterface.removeColumn('StaticPage', 'metaDescription'),
  ]),
};
