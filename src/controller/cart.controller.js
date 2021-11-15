
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
        note,
        //object array
        data
    } = req.body;

   // 
    if(!total_price||!id_user){
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
           id_customer: id_user,
           note: note
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
        let order
        if(st == 1 || st==2 || st==3 || st==4 || st==5){
             order = await Order.findAll({
                where: {
                    status: status
                }
            });
         }
        if(st == 6){
             order = await Order.findAll();
        }

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

        let st = parseInt(req.params.status)
        let status;
        switch(st){
            case 1: status = "pending"; break;
            case 2: status = "received"; break;
            case 3: status = "delivering"; break;
            case 4: status = "delivered"; break;
            case 5: status = "cancel"; break;
        }

        let getOrder
        if(st == 1 || st==2 || st==3 || st==4 || st==5){
            getOrder = await Order.findAll({
                where: {
                    id_customer :id_user,
                    status: status
                }
            });
         }
        if(st == 6){
            getOrder = await Order.findAll({
                where:{
                    id_customer :id_user,         
                    }
            });
        }


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
            totalPage: Math.ceil(count / 7),
            data: listOrder.reverse(),   
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
    updateStatus,
    filterOrder,
    cancel,
    getOrderbyUser
}