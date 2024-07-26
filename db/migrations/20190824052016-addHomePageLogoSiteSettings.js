

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('SiteSettings', [{
    title: 'Home Page Logo',
    name: 'homeLogo',
    value: null,
    type: 'site_settings',
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('SiteSettings', {
    name: {
      $in: ['homeLogo'],
    },
  }),
};
