const { DataTypes } = require('sequelize')
const db = require('../../utils/db');
const Brand = require('../model/brands.model')
const Category = require('../model/categories.model')
const extensionArr = ['jpg', 'jpeg', 'png']

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
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image1: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            checkExtension(value) {
                let [filename, extension] = value.split('.', 2)
                if (!extensionArr.includes(extension)) {
                    throw new Error('Invalid image format')
                }
            }
        }
    },
    image2: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            checkExtension(value) {
                let [filename, extension] = value.split('.', 2)
                if (!extensionArr.includes(extension)) {
                    throw new Error('Invalid image format')
                }
            }
        }
    },
    image3: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            checkExtension(value) {
                let [filename, extension] = value.split('.', 2)
                if (!extensionArr.includes(extension)) {
                    throw new Error('Invalid image format')
                }
            }
        }
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

})
// add foreign key
Brand.hasMany(Product, { foreignKey: 'id_brand', as: 'products' })
Product.belongsTo(Brand, { foreignKey: 'id_brand', as: 'brand' })

Category.hasMany(Product, { foreignKey: 'id_category', as: 'products' })
Product.belongsTo(Category, { foreignKey: 'id_category', as: 'category' })

// db.sync({alter : true})

module.exports = Product;

