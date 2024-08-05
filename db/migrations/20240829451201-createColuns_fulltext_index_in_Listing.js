module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            ALTER TABLE listing
            ADD FULLTEXT INDEX idx_locality_area_province_premise (locality, area, province, premise);
        `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            ALTER TABLE listing
            DROP INDEX idx_locality_area_province_premise;
        `);
    }
};
