const Product = require('../model/product.model')
const Brand = require('../model/brands.model')
const Category = require('../model/categories.model')
const cloudinary = require('../../utils/cloud.config')
const ranked = require('ranked')
const db = require('../../utils/db')
const Rank = require('../model/rank.model')

const extensionArr = ['jpg', 'jpeg', 'png']

const addProduct = async (req, res) => {
    let { id_brand, id_category } = req.body
    // console.log("brand", id_brand, "category", id_category)
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
                description,
                gender
            } = req.body

            const productMatch = await Product.findOne({ where: { name: name } })
            if (productMatch === null) {

                const product = Product.build({
                    name: name,
                    price: price,
                    description: description,
                    gender: gender,
                    id_brand: brand.id,
                    id_category: category.id
                })
                let files = new Array(3).fill(null)
                let types = new Array(3).fill(null)
                req.files.forEach((file, index) => {
                    files[index] = file.filename
                    types[index] = file.mimetype
                })
                const [image1, image2, image3, image4, image5] = files
                const [ex1, mimetype1] = types[0].split('/', 2)
                if (image1 !== null && extensionArr.includes(mimetype1)) {
                    await cloudinary.v2.uploader.upload(req.files[0].path, { tags: product.name }, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        // console.log(result)
                        product.image1 = result.url;
                    })
                }
                const [ex2, mimetype2] = types[1].split('/', 2)
                if (image2 !== null && extensionArr.includes(mimetype2)) {
                    await cloudinary.v2.uploader.upload(req.files[1].path, { tags: product.name }, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        product.image2 = result.url;
                    })
                }
                const [ex3, mimetype3] = types[2].split('/', 2)
                if (image3 !== null && extensionArr.includes(mimetype3)) {
                    await cloudinary.v2.uploader.upload(req.files[2].path, { tags: product.name }, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        product.image3 = result.url;
                    })
                }
                const [ex4, mimetype4] = types[3].split('/', 2)
                if (image4 !== null && extensionArr.includes(mimetype4)) {
                    await cloudinary.v2.uploader.upload(req.files[3].path, { tags: product.name }, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        product.image4 = result.url;
                    })
                }
                const [ex5, mimetype5] = types[4].split('/', 2)
                if (image5 !== null && extensionArr.includes(mimetype5)) {
                    await cloudinary.v2.uploader.upload(req.files[4].path, { tags: product.name }, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        product.image5 = result.url;
                    })
                }

                await product.save()

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
        if (product === null) {
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'Product does not exist'
            })
        } else {
            product.id_category = undefined,
                product.id_brand = undefined
            return res.json({
                code: 200,
                status: 'OK',
                data: product
            })
        }

    } catch (err) {
        console.log(err)
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
            await cloudinary.v2.api.delete_resources_by_tag(existProduct.name, (err, result) => {
                if (err) {
                    console.log(err)
                }
            });
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
        const { page , key } = req.query
        const data = await Product.findAll({
            include : ['category', 'brand']
        });
        var count = data.length
        
        let listProduct = []

        for (var i = 0; i < data.length; i++) {
            var plain = await data[i].get({ plain: true })
            plain['category'] = await data[i].getCategory()
            plain['brand'] = await data[i].getBrand()
            delete plain['id_category'];
            delete plain['id_brand'];
            listProduct.push(plain)
        }

        if(key) {
            let clearKey = key.trim()
            listProduct = listProduct.filter(product => {
                return product.name.toLowerCase().search(clearKey.toLowerCase()) !== -1
            })
        }

        if(page) {
            count = listProduct.length
            let offset = ((count - page * 7) > 0) ? count - page * 7 : 0
            let numberProduct = ((count - page * 7) >= 0) ? 7 : count % 7
            listProduct = listProduct.slice(offset, offset + numberProduct)
        }


        return res.json({
            code: 200,
            status: 'OK',
            queryWord : (key) ? key : '',
            totalMatch : (key) ? listProduct.length : 'No search action',
            totalPage:  (count) ? Math.ceil(count / 7) : 0,
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

        const { value } = req.body

        const product = await Product.findByPk(id_product)

        if (product !== null) {
            product.update({ active: value })
            return res.json({
                code: 200,
                status: 'OK',
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
        const { page, categoryId, brandId, gender } = req.query
        let sqlString = `SELECT * FROM tbl_products `
        let sqlWhere = `WHERE active = ${true}`
        if (brandId) {
            sqlWhere = sqlWhere.concat(' AND ', `id_brand = ${brandId}`)
        }
        if (categoryId) {
            sqlWhere = sqlWhere.concat(' AND ', `id_category = ${categoryId}`)
        }
        if (gender) {
            sqlWhere = sqlWhere.concat(' AND ', `gender = '${gender}'`)
        }
        sqlString = sqlString.concat('', sqlWhere)
        // console.log(sqlString)
        let data = await db.query(sqlString, {
            model: Product,
            mapToModel: true
        })
        const count = data.length
        if (page) {
            let offset = ((count - page * 12) > 0) ? count - page * 12 : 0
            let numberProduct = ((count - page * 12) >= 0) ? 12 : count % 12
            data = data.slice(offset, offset + numberProduct)
        }
        let listProduct = []
        for (var i = 0; i < data.length; i++) {
            var plain = await data[i].get({ plain: true })
            plain['category'] = await data[i].getCategory()
            plain['brand'] = await data[i].getBrand()
            delete plain['id_category'];
            delete plain['id_brand'];
            listProduct.push(plain)
        }
        return res.json({
            code: 200,
            status: 'OK',
            totalPage: Math.ceil(count / 12),
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

const searchProduct = async (req, res) => {
    try {
        const searchKey = req.query.key
        let data = await Product.findAll({
            where: { active: true },
            include: ['category', 'brand']
        })

        let clearKey = searchKey.trim()
        data = data.filter(product => {
            return product.name.toLowerCase().search(clearKey.toLowerCase()) !== -1
        })

        let listProduct = []
        for (var i = 0; i < data.length; i++) {
            var plain = await data[i].get({ plain: true })
            plain['category'] = await data[i].getCategory()
            plain['brand'] = await data[i].getBrand()
            delete plain['id_category'];
            delete plain['id_brand'];
            listProduct.push(plain)
        }

        if (req.query.page) {
            let count = listProduct.length
            let page = req.query.page
            let offset = ((count - page * 8) > 0) ? count - page * 8 : 0
            let numberProduct = ((count - page * 8) >= 0) ? 8 : count % 8
            listProduct = listProduct.slice(offset, offset + numberProduct)
        }

        return res.json({
            code: 200,
            status: 'OK',
            totalPage: Math.ceil(listProduct.length / 7),
            queryWord: searchKey,
            quantityMatch: listProduct.length,
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

const advancedSearch = async (req, res) => {
    try {
        const searchKey = req.query.key
        let data = await Product.findAll({
            where: { active: true },
            include: ['category', 'brand']
        })

        data = data.filter(product => {
            return product.name.toLowerCase().search(searchKey.toLowerCase()) !== -1
        })

        let listProduct = []
        for (var i = 0; i < data.length; i++) {
            var plain = await data[i].get({ plain: true })
            plain['category'] = await data[i].getCategory()
            plain['brand'] = await data[i].getBrand()
            delete plain['id_category'];
            delete plain['id_brand'];
            listProduct.push(plain)
        }

        let filters = req.query;
        delete filters.key
        delete filters.page
        if (typeof req.query !== {}) {

            listProduct = listProduct.filter(product => {
                let isValid = true;
                for (key in filters) {
                    // console.log(key, product[key], filters[key]);
                    isValid = isValid && product[key].name.toLowerCase() == filters[key].toLowerCase();
                }
                return isValid;
            });
        }

        if (req.query.page) {
            let count = listProduct.length
            let page = req.query.page
            let offset = ((count - page * 8) > 0) ? count - page * 8 : 0
            let numberProduct = ((count - page * 8) >= 0) ? 8 : count % 8
            listProduct = listProduct.slice(offset, offset + numberProduct)
        }

        return res.json({
            code: 200,
            status: 'OK',
            totalPage: Math.ceil(listProduct.length / 7),
            queryWord: searchKey,
            keyFilter: (filters !== {}) ? filters : null,
            quantityMatch: listProduct.length,
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
const getNewRelease = async (req, res) => {
    try {
        let data = await Product.findAll({
            where: { active: true },
            include: ['category', 'brand']
        })

        const offset = data.length - 5

        data = data.slice(offset, data.length)

        data.forEach(product => {
            product.id_brand = product.id_category = undefined
        })

        return res.json({
            code: 200,
            status: 'OK',
            totalNewRelease: data.length,
            data: data.reverse()
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
const calAverageRate = (reviews) => {
    if (reviews.length) {
        let totalWeight = 0
        let totalReviews = 0
        for (let i = 4; i >= 0; i--) {
            let eachItem = reviews[i] * (i + 1)
            totalWeight += eachItem
            totalReviews += reviews[i]
        }
        let average = totalWeight / totalReviews
        return parseFloat(average.toFixed(2))
    } else {
        return null
    }
}

const rating = (products) => {
    products.forEach(async product => {
        product.rank['rate'] = calAverageRate(product['review'])
        await Rank.update({ rate : product.rank['rate'] },{ where : { id : product.rank.id } })
    })


    // console.log( 'Calculate rating : ')
    // console.table(products)

    const scoreFn = product => product.rank['rate']

    var rankedItems = ranked.ranking(products, scoreFn)

    // console.log( 'Ranking : ', rankedItems)
    return { rankedItems }
}

const rankProduct = async (req, res) => {
    try {
        const data = await Product.findAll({
            where: { active: true },
            include: ['category', 'brand', 'rank']
        });
        let listProduct = []
        for (var i = 0; i < data.length; i++) {
            var plain = await data[i].get({ plain: true })
            delete plain['id_category'];
            delete plain['id_brand'];
            delete plain['id_rank'];
            listProduct.push(plain)
        }

        listProduct.forEach(product => {
            let review = []
            for (var key in product.rank) {
                if (!['id', 'rate', 'createdAt', 'updatedAt'].includes(key)) {
                    review.push(product.rank[key])
                }
            }
            product['review'] = review
        })

        listProduct = listProduct.filter(product => {
            return product['review'].length !== 0
        })

        let { rankedItems } = rating(listProduct)

        rankedItems.forEach(product => {
            delete product.item['review'];
        })

        return res.json({
            code: 200,
            status: 'OK',
            data: rankedItems.slice(0,4)
        })

    } catch (err) {
        console.log(err)
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: "Something went wrong"
        })
    }
}

const reviewProduct = async (req, res) => {
    try {
        const id_product = req.query.id
        const product = await Product.findByPk(id_product, {
            include : ['category', 'brand']
        })

        if (product) {
            var rankProduct = await Rank.findByPk(product.id_rank)
            const star = parseInt(req.query.star);
            if (rankProduct !== null) {
                switch (star) {
                    case 1:
                        await rankProduct.update({
                            oneStar: rankProduct.oneStar + 1
                        })
                        break;
                    case 2:
                        await rankProduct.update({
                            twoStar: rankProduct.twoStar + 1
                        })
                        break;
                    case 3:
                        await rankProduct.update({
                            threeStar: rankProduct.threeStar + 1
                        })
                        break;
                    case 4:
                        await rankProduct.update({
                            fourStar: rankProduct.fourStar + 1
                        })
                        break;
                    case 5:
                        await rankProduct.update({
                            fiveStar: rankProduct.fiveStar + 1
                        })
                        break;
                }
            } else {
                switch (star) {
                    case 1:
                        var newRank = Rank.build({ oneStar: 1 })
                        break;
                    case 2:
                        var newRank = Rank.build({ twoStar: 1 })
                        break;
                    case 3:
                        var newRank = Rank.build({ threeStar: 1 })
                        break;
                    case 4:
                        var newRank = Rank.build({ fourStar: 1 })
                        break;
                    case 5:
                        var newRank = Rank.build({ fiveStar: 1 })
                        break;
                }
                await newRank.save()
                product.setDataValue('id_rank', newRank.id)
                await product.save()
            }
            return res.json({
                code: 200,
                status: 'OK',
                rate: (rankProduct) ? rankProduct : newRank,
                data: product
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
        return res.json({
            code: 500, status: 'Internal Error', message: 'Something went wrong'
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
    getAllProductForCustomer,
    searchProduct,
    getNewRelease,
    rankProduct,
    reviewProduct,
    advancedSearch
}