const { DataTypes, Model } = require('sequelize')
const db = require('../../utils/db');
const orders= require('./order.model')
const products = require('./product.model')
const order_detail = db.define('tbl_orders_detail', {
    
    total_detail : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull:true
    }
    

})
products.hasMany(order_detail,{
    foreignKey: "id_product"
})

orders.hasMany(order_detail,{
    foreignKey: "id_order"
})
order_detail.sync({alter : true})

module.exports= order_detail