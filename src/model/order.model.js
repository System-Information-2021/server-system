const { DataTypes, Model } = require('sequelize')
const db = require('../../utils/db');
const order = db.define('tbl_orders', {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true,
        field : 'id_order'
    },
    total : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    

})

module.exports= order