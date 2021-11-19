const { DataTypes, Model } = require('sequelize')
const db = require('../../utils/db');
const user = require('../model/user.model')
const order = db.define('tbl_orders', {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true,
        field : 'id_order'
    },
    total_price : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    firstname : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: 'firstname must not be empty' },
            notNull: { msg: 'order must have a firstname' },
          }
    },
    lastname : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: 'lastname must not be empty' },
            notNull: { msg: 'order must have a lasttname' },
          }
    },
    address : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: 'address must not be empty' },
            notNull: { msg: 'order must have a address' },
          }
    },
    city : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: 'order must not be empty' },
            notNull: { msg: 'order must have a city' },
          }
    },
    numberphone : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notNull: { args: true, msg: "You must enter Phone Number" },
            len: { args: [10,11], msg: 'Phone Number is invalid' },
            isInt: { args: true, msg: "You must enter Phone Number" },
          }
    },
    status: {
        type : DataTypes.STRING,
        allowNull : false
    },
    email: {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: 'mail must not be empty' },
            notNull: { msg: 'order must have a mail' },
            isEmail:{msg: 'invalid email format'}
          }
    },
    note: {
        type : DataTypes.STRING,
        allowNull : true
    },

})
  //  foreignKey: customer
user.hasMany(order, { foreignKey: 'id_customer' , as : 'order'})
order.belongsTo(user, { foreignKey: 'id_customer', as: 'customer' })
    //  foreignKey: staff
user.hasMany(order, { foreignKey: 'id_staff' })
order.belongsTo(user, { foreignKey: 'id_staff'})

order.sync({alter : true})
module.exports= order