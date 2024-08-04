import Model from "../sequelize";
import DataType from "sequelize";

const ListingsInfo = Model.define('ListingsInfo', {

    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    country: {
        type: DataType.STRING,
    },
    province: {
        type: DataType.STRING,
    },
    area: {
        type: DataType.STRING,
    },
    locality: {
        type: DataType.STRING,
    },
    street: {
        type: DataType.STRING,
    },
    house: {
        type: DataType.STRING,
    },

    city: {
        type: DataType.STRING,
    },
    state: {
        type: DataType.STRING,
    },

    lat: {
        type: DataType.FLOAT,
    },
    lng: {
        type: DataType.FLOAT,
    },
    full_address: {
        type: DataType.TEXT,
    },
});

export default ListingsInfo;
