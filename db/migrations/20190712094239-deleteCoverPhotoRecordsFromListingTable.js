

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query('Update Listing set coverPhoto = null WHERE coverPhoto not in(select id from ListPhotos);'),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
  ]),
};
