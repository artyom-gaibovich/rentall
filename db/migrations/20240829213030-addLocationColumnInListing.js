module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('listing', 'location', {
            type: Sequelize.GEOMETRY('POINT'),
            allowNull: true,
        });
        await queryInterface.addIndex('listing', ['location'], {
            type: 'SPATIAL',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('listing', ['location']);
        await queryInterface.removeColumn('listing', 'location');
    },
};
