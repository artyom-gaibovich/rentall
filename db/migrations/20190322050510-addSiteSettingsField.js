

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('SiteSettings', [{
    title: 'Video URL',
    name: 'videoLink',
    value: 'https://www.youtube.com/watch?v=5y2P4z7DM88',
    type: 'site_settings',
    createdAt: new Date(),
    updatedAt: new Date(),
  }]),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('SiteSettings', {
    name: {
      $in: ['videoLink'],
    },
  }),
};
