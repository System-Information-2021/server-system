const { DataTypes } = require('sequelize')
const db = require('../../utils/db');
const Brand = require('../model/brands.model')
const Category = require('../model/categories.model');
const Rank = require('./rank.model');

const genderArr = ['male', 'female']

const Product = db.define('tbl_products', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_product'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Product must not be empty' },
            notNull: { msg: 'Product must have a name' }
        }
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: { msg: 'Price can only be an integer ' },
            notEmpty: { msg: 'Product must have a price' }
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    gender : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty : { msg : 'Gender is required' },
            notNull : { msg : 'Gender is required' },
            isGender(value) {
                if(typeof value === 'string' && !genderArr.includes(value.toLowerCase())) {
                    throw new Error('This is not the gender')
                }
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image1: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue : null
    },
    image2: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue : null
    },
    image3: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue : null
    },
    image4: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue : null
    },
    image5: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue : null
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

})
//Add foreign key
Brand.hasMany(Product, { foreignKey: 'id_brand', as: 'products' })
Product.belongsTo(Brand, { foreignKey: 'id_brand', as: 'brand' })

// Rank.hasOne(Product, {foreignKey : 'id_rank', as : 'product'})
// Product.belongsTo(Rank, {foreignKey : 'id_rank', as : 'rank'})

Category.hasMany(Product, { foreignKey: 'id_category', as: 'products' })
Product.belongsTo(Category, { foreignKey: 'id_category', as: 'category' })

// Product.sync({alter : true})

module.exports = Product;

