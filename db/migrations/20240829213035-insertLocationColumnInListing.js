'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
      UPDATE listing
      SET location = CASE
        WHEN lat REGEXP '^-?[0-9]+(\\\\.[0-9]+)?$' AND lng REGEXP '^-?[0-9]+(\\\\.[0-9]+)?$'
        THEN ST_PointFromText(CONCAT('POINT(', lng, ' ', lat, ')'))
        ELSE NULL
      END;
    `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('UPDATE listing SET location = NULL;');
    }
};
