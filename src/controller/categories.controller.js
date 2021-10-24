const Category = require('../model/categories.model')
const Product = require('../model/product.model')

const addCategory = async (req, res) => {
    let { name } = req.body;
    if (name) {
        name = name.charAt(0).toUpperCase() + name.slice(1);
        const existCategory = await Category.findOne({ where: { name: name } })
        if (existCategory === null) {
            const category = await Category.create({ name: name })
            return res.json({
                code: 200,
                status: 'Successfully',
                dataCreated: category
            })
        } else {
            return res.json({
                code: 400,
                status: 'Existed',
                message: 'Category is already added'
            })
        }
    } else {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Name is required'
        })
    }
}

const getCategoryById = async (req, res) => {
    const id_category = req.params.id_category
    const matchCategory = await Category.findByPk(id_category)

    if (matchCategory !== null) {
        return res.json({
            code: 200,
            status: 'Found',
            category: matchCategory
        })
    } else if (matchCategory === null) {
        return res.json({
            code: 400,
            status: 'Not found',
            message: 'Category id is not found'
        })
    }
}

const updateCategory = async (req, res) => {
    if (!req.params.id_category) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Category\'s id is required'
        })
    }

    const id_category = req.params.id_category

    const existCategory = await Category.findByPk(id_category)
    console.log(existCategory)

    if (existCategory !== null) {
        if (!req.body.name_category) {
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'Category\'s name is required'
            })
        }

        let name_category = req.body.name_category
        const checkCategory = await Category.findOne({
            where: {
                name: name_category
            }
        })
        if (checkCategory === null) {
            name_category = name_category.charAt(0).toUpperCase() + name_category.slice(1);
            const newCategory = await Category.update({
                name: name_category,
            },
                {
                    where: { id: id_category }
                }
            )
            return res.json({
                code: 200,
                status: 'Successfully',
            })
        } else if (checkCategory !== null) {
            return res.json({
                code: 400,
                status: 'Existed',
                message: 'Category does exist'
            })
        }
    } else if (existCategory === null) {
        return res.json({
            code: 400,
            status: 'Not Found',
            message: 'Category id is not found'
        })
    }
}

const deleteCategory = async (req, res) => {
    const id_category = req.params.id_category
    const existCategory = await Category.findByPk(id_category)

    if (existCategory !== null) {
        const result = await Category.destroy({
            where: {
                id: id_category
            }
        })
        return res.json({
            code: 200,
            status: 'Successfully'
        })
    } else if (existCategory === null) {
        return res.json({
            code: 400,
            status: 'Not found',
            message: 'Category id is not found'
        })
    }
}

const getAllCategories = async (req, res) => {
    try {
        if (req.query.page) {
            const page = req.query.page
            let { count } = await Category.findAndCountAll();
            let listCategory;

            if (count <= 7) {
                listCategory = await Category.findAndCountAll({
                    limit: 7,
                    offset: 0
                })
            } else {
                listCategory = await Category.findAndCountAll({
                    limit: ((count - page * 7) > 0) ? 7 : count % 7,
                    offset: ((count - page * 7) > 0) ? count - page * 7 : 0
                })
            }
            return res.json({
                code: 200,
                status: 'OK',
                totalPage: Math.ceil(listCategory.count / 7),
                data: listCategory.rows.reverse()
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

const getAllProductByCategory = async (req, res) => {
    try {
        const { id_category } = req.params

        const matchCategory = await Category.findByPk(id_category)

        if (matchCategory !== null) {
            const { count } = await Product.findAndCountAll({ where: { id_category: matchCategory.id } })
            const { page } = req.query
            let category;
            if (count <= 7) {
                category = await Category.findAndCountAll({
                    where: { id: matchCategory.id },
                    include: 'products'
                }, {
                    size: 7,
                    offset: 0
                })
            } else {
                category = await Category.findAndCountAll({
                    where: { id: matchCategory.id},
                    include: 'products'
                }, {
                    size: ((count - page * 7) > 0) ? 7 : count % 7,
                    offset: ((count - page * 7) > 0) ? (count - page * 7) : 0
                })
            }
            let [listProduct] = category.rows

            await listProduct.products.reverse()
            
            return res.json({
                code: 200,
                status: 'OK',
                data: listProduct
            })
        } else {
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'Category does not exist'
            })
        }
    } catch (err) {
        console.log(err)
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrong'
        })
    }
}

module.exports = {
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getAllProductByCategory
}
