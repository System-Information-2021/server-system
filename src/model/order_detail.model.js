const { DataTypes, Model } = require('sequelize')
const db = require('../../utils/db');
const orders= require('./order.model')
const products = require('./product.model')
const order_detail = db.define('tbl_orders_detail', {

    quantity:{
        type: DataTypes.INTEGER,
        allowNull:true
    }
    

})
products.hasMany(order_detail,{
    foreignKey: "id_product", as: 'order_detail'
})
order_detail.belongsTo(products, { foreignKey: 'id_product' , as: 'product' })

orders.hasMany(order_detail,{
    foreignKey: "id_order" , as: 'order_detail'
})
order_detail.belongsTo(orders, { foreignKey: 'id_order' , as: 'order'})

// order_detail.sync({alter : true})

module.exports= order_detail