const Product = require('../model/product.model')
const Brand = require('../model/brands.model')
const Category = require('../model/categories.model')
const path = require('path')

const addProduct = async (req, res) => {
    let { id_brand, id_category } = req.body
    console.log("brand", id_brand, "category", id_category)
    brand_id = parseInt(id_brand)
    category_id = parseInt(id_category)

    if (isNaN(brand_id) || isNaN(category_id)) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Brand or category have not been filled'
        })
    }

    try {
        const brand = await Brand.findByPk(brand_id)
        const category = await Category.findByPk(category_id)
        if (brand !== null && category !== null) {
            const {
                name,
                price,
                description
            } = req.body
            console.log(name, price, description)

            const productMatch = await Product.findOne({ where: { name: name } })
            if (productMatch === null) {
                const [{ filename: image1 }, { filename: image2 }, { filename: image3 }] = req.files
                const product = await Product.create({
                    name: name,
                    price: price,
                    image1: image1,
                    image2: image2,
                    image3: image3,
                    description: description,
                    id_brand: brand.id,
                    id_category: category.id
                })

                return res.json({
                    code: 200,
                    status: 'Created',
                    message: 'Successfully',
                    newRecord: product
                })
            } else {
                return res.json({
                    code: 400,
                    status: 'Bad Request',
                    message: 'Product does exist'
                })
            }
        } else {
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'Product must have both of the brand and the category'
            })
        }
    } catch (err) {
        console.log(err)
        if (err.errors) {
            let errors = []
            if (err.length > 1) {
                err.errors.forEach((each) => {
                    errors.push(each.message)
                })
            } else {
                errors.push(err.errors[0].message)
            }
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: errors
            })
        } else {
            return res.json({
                code: 500,
                status: 'Internal Error',
                message: 'Something went wrong'
            })
        }
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findOne({
            where: { id: id },
            include: { all: true }
        })
        product.id_category = undefined,
            product.id_brand = undefined
        return res.json({
            code: 200,
            status: 'OK',
            data: product
        })
    } catch (err) {
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something wnet wrong'
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id_product = req.params.id;
        const existProduct = await Product.findByPk(id_product)
        if (existProduct !== null) {
            await existProduct.destroy()
            return res.json({
                code: 200,
                status: 'Deleted',
                message: 'Successfully'
            })
        } else {
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'Product does not exist'
            })
        }
    } catch (err) {
        console.log(err)
        res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrong'
        })
    }
}

const updateProductInfo = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findByPk(id)
        if (product !== null) {
            const { name, price, description, id_brand, id_category } = req.body

            const brand = await Brand.findByPk(id_brand)
            const category = await Category.findByPk(id_category)

            if (brand !== null && category !== null) {
                product.update({
                    name: name,
                    price: price,
                    description: description,
                    id_brand: brand.id,
                    id_category: category.id
                })

                return res.json({
                    code: 200,
                    status: 'Updated',
                    message: 'Sucessfully'
                })
            } else {
                return res.json({
                    code: 400,
                    status: 'Bad Request',
                    message: 'Product must have both of the brand and category'
                })
            }
        } else if (product === null) {
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'Product does not exist'
            })
        }
    } catch (err) {
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrong'
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const { page } = req.query
        const { count } = await Product.findAndCountAll();
        let listProduct = []
        let data;
        if (count <= 7) {
            data = await Product.findAll({
                limit: 7,
                offset: 0
            })
            for (var i = 0; i < data.length; i++) {
                let category = await data[i].getCategory()
                let brand = await data[i].getBrand()
                data[i].id_brand = data[i].id_category = undefined
                var plain = await data[i].get({ plain: true })
                plain['category'] = await category.get({ plain: true })
                plain['brand'] = await brand.get({ plain: true })
                listProduct.push(plain)
            }
        } else {
            console.log(count % 7, count - page * 7)
            data = await Product.findAll({
                limit: ((count - page * 7) >= 0 ) ? 7 : count % 7,
                offset: ((count - page * 7) > 0) ? count - page * 7 : 0
            })
            
            for (var i = 0; i < data.length; i++) {
                let category = await data[i].getCategory()
                let brand = await data[i].getBrand()
                data[i].id_brand = data[i].id_category = undefined
                var plain = await data[i].get({ plain: true })
                plain['category'] = await category.get({ plain: true })
                plain['brand'] = await brand.get({ plain: true })
                listProduct.push(plain)
            }
        }
        return res.json({
            code: 200,
            status: 'OK',
            totalPage: Math.ceil(count / 7),
            data: listProduct.reverse()
        })
    } catch (err) {
        console.log(err)
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrong'
        })
    }
}

const activeProduct = async (req, res) => {
    try {
        const { id_product } = req.params

        const product = await Product.findByPk(id_product)

        if (product !== null) {
            product.update({ active: true })
            return res.json({
                code: 200,
                status: 'Actived',
                message: 'Successfully'
            })
        } else {
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'Product does not exist'
            })
        }
    } catch (err) {
        return res.json({
            code: 500,
            status: 'Interal Error',
            message: 'Something went wrong'
        })
    }
}


const getAllProductForCustomer = async (req, res) => {
    try {
        const { page } = req.query
        const { count } = await Product.findAndCountAll();
        let listProduct = []
        let data;
        if (count <= 7) {
            data = await Product.findAll({ where : { active : true } },{
                limit: 7,
                offset: 0
            })
            for (var i = 0; i < data.length; i++) {
                let category = await data[i].getCategory()
                let brand = await data[i].getBrand()
                data[i].id_brand = data[i].id_category = undefined
                var plain = await data[i].get({ plain: true })
                plain['category'] = await category.get({ plain: true })
                plain['brand'] = await brand.get({ plain: true })
                listProduct.push(plain)
            }
        } else {
            console.log(count % 7, count - page * 7)
            data = await Product.findAll({ where : { active : true } },{
                limit: ((count - page * 7) >= 0 ) ? 7 : count % 7,
                offset: ((count - page * 7) > 0) ? count - page * 7 : 0
            })
            
            for (var i = 0; i < data.length; i++) {
                let category = await data[i].getCategory()
                let brand = await data[i].getBrand()
                data[i].id_brand = data[i].id_category = undefined
                var plain = await data[i].get({ plain: true })
                plain['category'] = await category.get({ plain: true })
                plain['brand'] = await brand.get({ plain: true })
                listProduct.push(plain)
            }
        }
        return res.json({
            code: 200,
            status: 'OK',
            totalPage: Math.ceil(count / 7),
            data: listProduct.reverse()
        })
    } catch (err) {
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrong'
        })
    }
}

module.exports = {
    addProduct,
    getProductById,
    deleteProduct,
    updateProductInfo,
    getAllProduct,
    activeProduct,
    getAllProductForCustomer
}