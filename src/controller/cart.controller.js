
const Product = require('../model/product.model')
const Order = require('../model/order.model')
const Order_detail= require('../model/order_detail.model')

const order= async(req,res)=>{
    let{
        firstname,
        lastname,
        address,
        city,
        numberphone,
        total_price,
        total_qty,
        //object array
        data
    }= req.body;

   // 
    if(!firstname ||!lastname||!address||!city||!numberphone||!total_price||!total_qty){
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'fill all field, pleas'
        })
    }else if (!data || !isNaN(data)) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'shopping cart does not exist'
        })
    } 
    try{
        const order = new Order({
           firstname: firstname,
           lastname: lastname,
           address: address,
           city: city,
           numberphone: numberphone,
           total_price:total_price,
           total_qty: total_qty,
           status: 'chờ tiếp nhận',
        })
        await order.save()
        for (let i = 0; i < data.length; i++) {
            const product = await  Product.findByPk(data[i].id_product);
            if(product ===null) return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'Product does exist'
            })
            else{
                const orderdetail= await new Order_detail({
                    total_detail : data[i].total_detail,
                    quantity : data[i].qty,
                    id_order : order.id,
                    id_product : data[i].id_product
                })
               await  orderdetail.save()
            }
        }
        res.json({
            code: 200,
            status: 'successfully',
            message: "Dat hang thanh cong"
        })
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
const getcart =async(req,res)=>{
    try{
        const { page } = req.query
        const { count } = await Order.findAndCountAll();
        //let listOrder = [];
        console.log(page);
        console.log(count);
        console.log(count % 7, count - page * 7)
        if (count <= 7) {
            data = await Order.findAll({
                limit: 7,
                offset: 0
            })
        //listOrder.push(data);
        console.log(data)
        }else{
            console.log(count % 7, count - page * 7)
            data = await Order.findAll({
                limit: ((count - page * 7) >= 0) ? 7 : count % 7,
                offset: ((count - page * 7) > 0) ? count - page * 7 : 0
            })
        }
        return res.json({
            code: 200,
            status: 'OK',
            totalPage: Math.ceil(count / 7),
            data: data.reverse()
        })
    }catch (err) {
        console.log(err)
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrong'
        })
    }
}  
const updateStatus = async(req,res)=>{
    try{
        if (!req.params.id) {
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'have no this order'
            })
        }

        const id = req.params.id

        const existOrder = await Order.findByPk(id)
        

        if (existOrder !== null) {
            if (!req.body.status) {
                return res.json({
                    code: 400,
                    status: 'Bad Request',
                    message: 'have no this order'
                })
            }
            let status = req.body.status
            status= status.charAt(0).toUpperCase() + status.slice(1);
            const newBrand = await Order.update({
                    status: status
            },
                {
                    where: { id_order : id }
                }
            )
            return res.json({
                code: 200,
                status : 'Successfully',
            
            })
        
        } else if(existOrder === null) {
            return res.json({
                code : 400,
                status : 'Not Found',
                message : 'Brand id is not found'
            })
        }
    }catch (err) {
        console.log(err)
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrong'
        })
    }
}

const filterOrder =async(req,res)=>{
    try{
        const { page} = req.query
        const status = req.body.status
        console.log(status)
        const order = await Order.findAll({
            where: {
            status: status
            }
        });
        if (order.length <= 7) {
            data = await Order.findAll({
                limit: 7,
                offset: 0,
                where: {
                status: status
                }
            })
        }
        else{
            data = await Order.findAll({
                limit: ((order.length - page * 7) >= 0) ? 7 : order.length % 7,
                offset: ((order.length - page * 7) > 0) ? order.length - page * 7 : 0,
                where: {
                    status: status
                }
            })
        }
        res.json({
            code: 200,
            message:'succesfully',
            totalPage: Math.ceil(order.length / 7),
            data: data.reverse()
            
        })
    }catch (err) {
        console.log(err)
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrong'
        })
    }
}

const orderdetail =async(req,res)=>{
    try{

   
        const detail = req.params.id;
        if(!detail || isNaN(detail)){
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'fail '
            })
        }
        const order = await Order.findByPk(detail);
        const detailOrder = await Order_detail.findAll({
            where: {
                id_order: detail
            }
        });
        if(!order || !detailOrder){
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'fail'
            })
        }
        res.json({
            code: 200,
            message: 'successfully',
            order: order,
            datail: detailOrder
        })
    }catch (err) {
        console.log(err)
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrong'
        })
    }
}
module.exports = {
    order,
    getcart,
    updateStatus,
    filterOrder,
    orderdetail
}