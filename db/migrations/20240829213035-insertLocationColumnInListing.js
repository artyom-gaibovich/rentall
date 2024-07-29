module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
      UPDATE listing
      SET location = ST_GeomFromText(CONCAT('POINT(', lng, ' ', lat, ')'))
    `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
      UPDATE listing
      SET location = NULL
    `);
    },
};
