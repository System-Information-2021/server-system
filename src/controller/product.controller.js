const Product = require('../model/product.model')
const Brand = require('../model/brands.model')
const Category = require('../model/categories.model')
const path = require('path')

const addProduct = async (req,res) => {
    const { id_brand , id_category } = req.body
    try {
        const brand = await Brand.findByPk(id_brand)
        const category = await Category.findByPk(id_category)
        if(brand !== null && category !== null) {
            const { 
                name, 
                price,
                description
            } = req.body
            const productMatch = await Product.findOne({where : { name : name }})
            if(productMatch === null) {
                const [{filename : image1} , {filename : image2}, {filename : image3} ] = req.files
                const product = await Product.create({
                    name : name,
                    price : price,
                    image1 : image1,
                    image2 : image2,
                    image3 : image3,
                    description : description,
                    id_brand : brand.id,
                    id_category : category.id
                })
    
                return res.json({
                    code : 200,
                    status : 'Created',
                    message : 'Successfully',
                    newRecord : product
                })
            } else {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    message : 'Product does exist'
                   })
            }
        } else {
            return res.json({
                code : 400,
                status : 'Bad Request',
                message : 'Product must have both of the brand and the category'
            })
        }
    } catch (err) {
        let errors = []
        
        err.errors.forEach((each) => {
            errors.push(each.message)
        })
        return res.json({
            code : 400,
            status : 'Bad Request',
            message : errors
        })
    }
}

const getProductById = async (req,res) => {
    try {
        const { id } = req.params
        const product = await Product.findOne({
            where : { id : id },
            include : { all : true }
        })
        product.id_category = undefined,
        product.id_brand = undefined
        return res.json({
            code : 200,
            status : 'OK',
            data : product
        })
    } catch (err) {
        res.json(err)
    }
}

const deleteProduct = async (req,res) => {
    try {
        const id_product = req.params.id;
        const existProduct = await Product.findByPk(id_product)
        if(existProduct !== null) {
            await existProduct.destroy()
            return res.json({
                code : 200,
                status : 'Deleted',
                message : 'Successfully'
            })
        } else {
            return res.json({
                code : 400,
                status : 'Bad Request',
                message : 'Product does not exist'
            })
        }
    } catch (err) {
        console.log(err)
        res.json({
            code : 500,
            status : 'Internal Error',
            message : 'Something went wrong'
        })
    }
}

const updateProductInfo = async (req,res) => {
    try {
        const id  = req.params.id
        const product = await Product.findByPk(id)
        if(product !== null) {
            const { name , price , description , id_brand , id_category } = req.body

            const brand = await Brand.findByPk(id_brand)
            const category = await Category.findByPk(id_category)

            if(brand !== null && category !== null) {
                product.update({
                    name : name,
                    price : price,
                    description : description,
                    id_brand : brand.id,
                    id_category : category.id
                })

                return res.json({
                    code : 200,
                    status : 'Updated',
                    message : 'Sucessfully'
                })
            } else {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    message : 'Product must have both of the brand and category'
                })
            }
        } else if(product === null) {
            return res.json({
                code : 400,
                status : 'Bad Request',
                message : 'Product does not exist'
            })
        }
    } catch (err) {
        return res.json({
            code : 500,
            status : 'Internal Error',
            message : 'Something went wrong'
        })
    }
}

const getAllProduct = async (req,res) => {
    try {
        const { page } = req.query
        const { count } = await Product.findAndCountAll();

        let listProduct;

        if(count <= 7) {
            listProduct = await Product.findAndCountAll({ include : { all : true } }, {
                limit : 7,
                offset : 0
            })
        } else {
            listProduct = await Product.findAndCountAll({ include : { all : true } },{
                limit : ((count - page*7) > 0) ? 7 : count%7,
                offset : ((count - page*7) > 0) ? count - page*7 : 0
            })
        }
        listProduct.rows.forEach((product) => {
            product.id_brand = product.id_category = undefined
        })
        return res.json({
            code : 200,
            status : 'OK',
            totalPage : Math.ceil(count/7),
            data : listProduct.rows.reverse()
        })
    } catch (err) {
        return res.json({
            code : 500,
            status : 'Internal Error',
            message : 'Something went wrong' 
        })
    }
}

const activeProduct = async (req,res) => {
    try {
        const { id_product } = req.params

        const product = await Product.findByPk(id_product)

        if(product !== null) {
            product.update({ active : true })
            return res.json({
                code : 200,
                status : 'Actived',
                message : 'Successfully'
            })
        } else {
            return res.json({
                code : 400,
                status : 'Bad Request',
                message : 'Product does not exist'
            })
        }
    } catch (err) {
        return res.json({
            code : 500,
            status : 'Interal Error',
            message : 'Something went wrong'
        })
    }
}


const getAllProductForCustomer = async (req,res) => {
    try {
        const { page } = req.query
        const { count } = await Product.findAndCountAll({ where : { active : true } });

        let listProduct;

        if(count <= 7) {
            listProduct = await Product.findAndCountAll({ where : { active : true } , include : { all : true } }, {
                limit : 7,
                offset : 0
            })
        } else {
            listProduct = await Product.findAndCountAll({ where : { active : true } , include : { all : true } },{
                limit : ((count - page*7) > 0) ? 7 : count%7,
                offset : ((count - page*7) > 0) ? count - page*7 : 0
            })
        }
        listProduct.rows.forEach((product) => {
            product.id_brand = product.id_category = undefined
        })
        return res.json({
            code : 200,
            status : 'OK',
            totalPage : Math.ceil(count/7),
            data : listProduct.rows.reverse()
        })
    } catch (err) {
        return res.json({
            code : 500,
            status : 'Internal Error',
            message : 'Something went wrong' 
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