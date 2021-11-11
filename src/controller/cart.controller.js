
const Product = require('../model/product.model')
const Order = require('../model/order.model')
const Order_detail = require('../model/order_detail.model')
const User = require('../model/user.model')
const Op = require('sequelize').Op

const order= async(req,res)=>{
    var id_user =await req.body.id_user;
    let{
        firstname,
        lastname,
        address,
        city,
        numberphone,
        total_price,
        //object array
        data
    } = req.body;

   // 
    if(!firstname ||!lastname||!address||!city||!numberphone||!total_price||!id_user){
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'fill all field, pleas'
        })
    } else if (!data || !isNaN(data)) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'shopping cart does not exist'
        })
    }
    try {
        const order = new Order({
           firstname: firstname,
           lastname: lastname,
           address: address,
           city: city,
           numberphone: numberphone,
           total_price:total_price,
           status: 'pending',
           id_customer: id_user
        })
        await order.save()
        for (let i = 0; i < data.length; i++) {
            const product = await  Product.findByPk(data[i].id);
            if(product ===null) return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'Product does exist'
            })
            else{
                const orderdetail= await new Order_detail({
                    quantity : data[i].qty,
                    id_order : order.id,
                    id_product : data[i].id
                })
                await orderdetail.save()
            }
        }
        res.json({
            code: 200,
            status: 'Created',
            message: "Order successfully"
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
const getcart = async (req, res) => {
    try {
        const { page } = req.query
        const { count } = await Order.findAndCountAll();
        if (count <= 7) {
            data = await Order.findAll({
                limit: 7,
                offset: 0
            })
        } else {
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
    } catch (err) {
        console.log(err)
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrong'
        })
    }
}
const updateStatus = async (req, res) => {
    try {
        const st = parseInt(req.params.st);
        const id = req.params.id;
        let status;
        switch(st){
            case 1: status = "pending"; break;
            case 2: status = "received"; break;
            case 3: status = "delivering"; break;
            case 4: status = "delivered"; break;
            case 5: status = "cancel"; break;
        }
        const existOrder = await Order.findByPk(id)
        if (existOrder !== null) {
            const newBrand = await Order.update({
                status: status
            },
                {
                    where: { id_order: id }
                }
            )
            return res.json({
                code: 200,
                status: 'Updated',
                message: 'update successfully'

            })
        } else if (existOrder === null) {
            return res.json({
                code: 400,
                status: 'Not Found',
                message: 'This order is not found'
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

const filterOrder = async (req, res) => {
    try {
        const { page } = req.query
        let st = parseInt(req.params.status)
        let status;
        switch(st){
            case 1: status = "pending"; break;
            case 2: status = "received"; break;
            case 3: status = "delivering"; break;
            case 4: status = "delivered"; break;
            case 5: status = "cancel"; break;
        }
        const order = await Order.findAll({
            where: {
                status: status
            }
        });

        let listOrder = [];
        for(let i= 0 ; i<order.length; i++){
            let plain = await order[i].get({ plain : true});
            let orderdetail = await Order_detail.findAll({
                where: {
                    id_order: plain.id
                },
                include: [ 'product' ]
            })
            let listproducts = []
            for(let j =0 ; j<orderdetail.length;j++ )
            {   
                let product = orderdetail[j].product.get({plain: true});
                product['qty'] = orderdetail[j].quantity;
                product.quantity = product.description = product.gender = product.active = undefined;
                listproducts.push (product)
            } 
            plain['products'] = listproducts;
            listOrder.push(plain)      
        }
        const count = listOrder.length
        if (page) {
            let offset = ((count - page * 7) > 0) ? count - page * 7 : 0
            let numberProduct = ((count - page * 7) >= 0) ? 7 : count % 7
            listOrder = listOrder.slice(offset, offset + numberProduct)
        }
        res.json({
            code: 200,
            message: 'succesfully',
            totalPage: Math.ceil(order.length / 7),
            data: listOrder.reverse(),
            
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


const cancel = async(req,res)=>{
    try{
            const id = req.params.id;
            const order = await Order.findByPk(id);
            if(!order ){
                return res.json({
                    code: 400,
                    status: 'Bad Request',
                    message: 'failll'
                })
            }
            if(order.status== 'delivered'|| order.status=='delivering'|| order.status=='cancel'){
                return res.json({
                    code: 400,
                    status: 'Bad Request',
                    message: 'can not cancel this order'
                })
            }
            await Order.update({
                    status: 'cancel'
            },
                {
                    where: { id_order : id }
                }
            )
            return res.json({
                code: 200,
                status: 'cancel',
                message: 'cancel succesfully'
    
            })
        }

     catch (err) {
        console.log(err)
        return res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrong'
        })
    }
}

const getOrderbyUser = async(req,res)=>{
    try{
        const { page} = req.query
        var id_user =await req.params.id_user;
        const getOrder = await Order.findAll({
            where:{
                id_customer :id_user,
                status: {
                    [Op.or]: ['pending' ,'received', 'delivering' , 'delivered', 'cancel' ]
                }
            }
        }); 
        let listOrder = [];
        for(let i= 0 ; i<getOrder.length; i++){
            let plain = await getOrder[i].get({ plain : true});
            let orderdetail = await Order_detail.findAll({
                where: {
                    id_order: plain.id

                },
                include: [ 'product' ]
            })
            let listproducts = []
            for(let j =0 ; j<orderdetail.length;j++ )
            {   
                let product = orderdetail[j].product.get({plain: true});
                product['qty'] = orderdetail[j].quantity;
                product.quantity = product.description = product.gender = product.active = undefined;
                listproducts.push (product)
            } 
            plain['products'] = listproducts;
            listOrder.push(plain)      
        }
        const count = listOrder.length
        if (page) {
            let offset = ((count - page * 7) > 0) ? count - page * 7 : 0
            let numberProduct = ((count - page * 7) >= 0) ? 7 : count % 7
            listOrder = listOrder.slice(offset, offset + numberProduct)
        }
        res.json({
            code: 200,
            status: 'OK',
            totalPage: Math.ceil(listOrder.length / 7),
            list: listOrder.reverse(),   
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
  
    cancel,
    getOrderbyUser
}