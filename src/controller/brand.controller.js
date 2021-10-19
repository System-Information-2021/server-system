
const Brand = require('../model/brands.model')

const addBrand = async (req, res) => {
    let { name } = req.body;
    if (name) {
        name = name.charAt(0).toUpperCase() + name.slice(1);
        const existBrand = await Brand.findOne({ where: { name: name } })
        if (existBrand === null) {
            const brand = await Brand.create({ name: name })
            return res.json({
                code: 200,
                status: 'Successfully',
                dataCreated: brand
            })
        } else {
            return res.json({
                code: 400,
                status: 'Existed',
                message: 'Brand is already added'
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

const getBrandById = async (req, res) => {
    const id_brand = req.params.id_brand
    const matchBrand = await Brand.findByPk(id_brand)

    if (matchBrand !== null) {
        return res.json({
            code: 200,
            status: 'Found',
            brand: matchBrand
        })
    } else if (matchBrand === null) {
        return res.json({
            code: 400,
            status: 'Not found',
            message: 'Brand id is not found'
        })
    }
}

const updateBrand = async (req, res) => {
    if (!req.params.id_brand) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'Brand\'s id is required'
        })
    }

    const id_brand = req.params.id_brand

    const existBrand = await Brand.findByPk(id_brand)
    

    if (existBrand !== null) {
        if (!req.body.name_brand) {
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'Brand\'s name is required'
            })
        }

        let name_brand = req.body.name_brand
        const checkBrand = await Brand.findOne({
            where : {
                name : name_brand
            }
        })
        if(checkBrand === null) {
            name_brand = name_brand.charAt(0).toUpperCase() + name_brand.slice(1);
            const newBrand = await Brand.update({
                name: name_brand,
            },
                {
                    where: { id : id_brand }
                }
            )
            return res.json({
                code: 200,
                status : 'Successfully',
            })
        } else if(checkBrand !== null) {
            return res.json({
                code : 400, 
                status : 'Existed',
                message : 'Brand does exist'
            })
        }
    } else if(existBrand === null) {
        return res.json({
            code : 400,
            status : 'Not Found',
            message : 'Brand id is not found'
        })
    }
}

const deleteBrand = async (req,res) => {
    const id_brand = req.params.id_brand
    const existBrand = await Brand.findByPk(id_brand)

    if(existBrand !== null) {
        const result = await Brand.destroy({
            where : {
                id : id_brand
            }
        })
        return res.json({
            code : 200,
            status : 'Successfully'
        })
    } else if(existBrand === null) {
        return res.json({
            code : 400,
            status : 'Not found',
            message : 'Brand id is not found'
        })
    }
}

const getAllBrand = async (req,res) => {
    try {
        const listBrand = await Brand.findAll()
        return res.json({
            code : 200,
            status : 'OK',
            data : listBrand
        })
    } catch (err) {
        return res.json({
            code : 500,
            status : 'Interal Error',
            message : 'Something went wrong'
        })
    }
}

module.exports = {
    addBrand,
    getBrandById,
    updateBrand,
    deleteBrand,
    getAllBrand
}
