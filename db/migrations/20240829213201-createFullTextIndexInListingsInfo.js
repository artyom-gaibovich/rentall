module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            ALTER TABLE listings_info
            ADD FULLTEXT INDEX idx_locality_area_province (locality, area, province);
        `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            ALTER TABLE listings_info
            DROP INDEX idx_locality_area_province;
        `);
    }
};
