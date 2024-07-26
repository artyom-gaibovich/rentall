import DataType from 'sequelize';
import Model from '../sequelize';

const UserFish = Model.define('UserFish', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  listId: {
    type: DataType.INTEGER,
    allowNull: false,
  },

  fishId: {
    type: DataType.INTEGER,
    allowNull: false,
  },

});

export default UserFish;
