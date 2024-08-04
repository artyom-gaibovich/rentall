'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            ALTER TABLE listing
                ADD FULLTEXT INDEX idx_city_street (city, street);
        `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            ALTER TABLE listing
            DROP INDEX idx_city_street;
        `);
    }
};
