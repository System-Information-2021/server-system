const { DataTypes } = require('sequelize')
const db = require('../../utils/db');
const brand = require('../model/brands.model')
const categories = require('../model/categories.model')
const product = db.define('tbl_products', {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true,
        field : 'id_product'
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    price : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    quantity : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    description : {
        type : DataTypes.STRING,
        allowNull : false
    },
    image1 : {
        type : DataTypes.STRING,
        allowNull : false
    },
    image2 : {
        type : DataTypes.STRING,
        allowNull : false
    },
    image3 : {
        type : DataTypes.STRING,
        allowNull : false
    },
    active :{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

})
  // add foreign key
brand.hasMany(product, {
    foreignKey: 'id_brand'
  });
 
categories.hasMany(product,{
    foreignKey: 'id_category'
});


db.sync({alter : true});
module.exports = product;

