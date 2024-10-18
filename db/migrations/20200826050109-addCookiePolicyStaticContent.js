

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('StaticPage', [
      {
        pageName: 'Cookie Policy',
        content: '<p></p>',
        metaTitle: 'Cookie Policy',
        metaDescription: 'Cookie Policy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkDelet('StaticPage', {
      pageName: {
        $in: ['Cookie Policy'],
      },
    }),
  ]),
};
