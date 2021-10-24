const { DataTypes } = require('sequelize')
const db = require('../../utils/db');

const Category = db.define('tbl_categories', {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true,
        field : 'id_category'
    },
    name : {
        type : DataTypes.STRING,
        field : 'name_category',
        allowNull : false
    }
})

// Category.sync({alter : true})

module.exports = Category;