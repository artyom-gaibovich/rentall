'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('listing', 'location', {
            type: Sequelize.GEOMETRY('POINT'),
            allowNull: true
        });

        await queryInterface.sequelize.query('CREATE SPATIAL INDEX listing_location_spatial ON listing(location);');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('listing', 'location');
    }
};
