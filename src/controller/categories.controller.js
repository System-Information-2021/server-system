const e = require('express');
const Category = require('../model/categories.model')

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
    if (!req.params.id_category) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Category id is required '
        })
    }
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
            where : {
                name : name_category
            }
        })
        if(checkCategory === null) {
            name_category = name_category.charAt(0).toUpperCase() + name_category.slice(1);
            const newCategory = await Category.update({
                name: name_category,
            },
                {
                    where: { id : id_category }
                }
            )
            return res.json({
                code: 200,
                status : 'Successfully',
            })
        } else if(checkCategory !== null) {
            return res.json({
                code : 400, 
                status : 'Existed',
                message : 'Category does exist'
            })
        }
    } else if(existCategory === null) {
        return res.json({
            code : 400,
            status : 'Not Found',
            message : 'Category id is not found'
        })
    }
}

const deleteCategory = async (req,res) => {
    const id_category = req.params.id_category
    const existCategory = await Category.findByPk(id_category)

    if(existCategory !== null) {
        const result = await Category.destroy({
            where : {
                id : id_category
            }
        })
        return res.json({
            code : 200,
            status : 'Successfully'
        })
    } else if(existCategory === null) {
        return res.json({
            code : 400,
            status : 'Not found',
            message : 'Category id is not found'
        })
    }
}

module.exports = {
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}