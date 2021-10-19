const { DataTypes } = require('sequelize')
const db = require('../../utils/db')

const Brand = db.define('tbl_brand', {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true,
        field : 'id_brand'
    },
    name : {
        type : DataTypes.STRING,
        field : 'name_brand',
        allowNull : false
    }
})
db.sync({ alter : true })

module.exports = Brand;