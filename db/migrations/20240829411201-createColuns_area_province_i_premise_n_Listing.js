module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            ALTER TABLE listing
                ADD COLUMN premise VARCHAR(255),
            ADD COLUMN province VARCHAR(255),
            ADD COLUMN area VARCHAR(255);
        `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            ALTER TABLE listing
            DROP COLUMN province,
            DROP COLUMN area;
        `);
    }
};
