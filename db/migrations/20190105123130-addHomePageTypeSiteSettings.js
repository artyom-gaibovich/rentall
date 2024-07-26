

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('SiteSettings', [{
    title: 'Home Page Banner Layout',
    name: 'homePageType',
    value: '1',
    type: 'site_settings',
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('SiteSettings', {
    name: {
      $in: ['homePageType'],
    },
  }),
};
