

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.createTable('UserFish', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      listId: {
        type: Sequelize.INTEGER,
        references: { model: 'listing', key: 'id' },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      fishId: {
        type: Sequelize.INTEGER,
        references: { model: 'listsettings', key: 'id' },
      },
    }),
    queryInterface.bulkInsert('listsettingstypes', [
      {
        id: 101,
        typeName: 'fish',
        fieldType: 'stringType',
        step: 3,
        isEnable: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        typeLabel: 'Fish',
        isMultiValue: 1,
      },
    ]),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.dropTable('UserFish'),
    queryInterface.bulkDelete('listsettingstypes', {
      id: {
        $in: [101],
      },
    }),
  ]),
};
