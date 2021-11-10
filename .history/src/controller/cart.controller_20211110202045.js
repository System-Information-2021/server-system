
const Product = require('../model/product.model')
const Order = require('../model/order.model')
const Order_detail= require('../model/order_detail.model')
const User = require('../model/user.model')
// const Op = require('Sequelize').Op

const order= async(req,res)=>{
    var token =await req.headers.token;
    const user = await User.findOne({
        where:{
            token : token 
        }
    })
    if(user=== null){
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'user invalided'
        })
    }
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
           status: 'Pending',
           id_customer: user.id
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
const getcart =async(req,res)=>{
    try{
        const { page } = req.query
        const { count } = await Order.findAndCountAll();
        if (count <= 7) {
            data = await Order.findAll({
                limit: 7,
                offset: 0
            })
        }else{
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
        const st =parseInt( req.params.st);
        const id = req.params.id;
        let status;
        switch(st){
            case 1: status = "Pending"; break;
            case 2: status = "Received"; break;
            case 3: status = "Delivering"; break;
            case 4: status = "Delivered"; break;
            case 5: status = "Cancel"; break;
        }
        const existOrder = await Order.findByPk(id)        
        if (existOrder !== null) {
            const newBrand = await Order.update({
                    status: status
            },
                {
                    where: { id_order : id }
                }
            )
            return res.json({
                code: 200,
                status: 'Updated',
                message: 'update successfully'
            
            })
        } else if(existOrder === null) {
            return res.json({
                code : 400,
                status : 'Not Found',
                message : 'This order is not found'
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
        let st = parseInt( req.params.status)
        let status;
        switch(st){
            case 1: status = "Pending"; break;
            case 2: status = "Received"; break;
            case 3: status = "Delivering"; break;
            case 4: status = "Delivered"; break;
            case 5: status = "Cancel"; break;
        }
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
        var orderr = new Array();
        var detaill= new Array();
        console.log(detailOrder.length);
        var plain = await order.get({plain: true})   
        for (var i = 0; i < detailOrder.length; i++) {
            var plain1 = await detailOrder[i].get({plain: true})
            plain1['product'] = await Product.findByPk(plain1.id_product);    
            detaill.push(plain1)
            detailOrder[i].id_order =detailOrder[i].id_product = undefined
        }
            plain['detail'] = detaill
            orderr.push(order)
        res.json({
            code: 200,
            message: 'successfully',
            order: orderr,
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
            if(order.status== 'Delivered'|| order.status=='Delivering'|| order.status=='Cancel'){
                return res.json({
                    code: 400,
                    status: 'Bad Request',
                    message: 'can not cancel this order'
                })
            }
            await Order.update({
                    status: 'Cancel'
            },
                {
                    where: { id_order : id }
                }
            )
            return res.json({
            code: 200,
            status : 'cancel',
            message: 'cancel succesfully'
        
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

// const getOrderbyUser = async(req,res)=>{
//     try{
//         const { page} = req.query
//         var token =await req.headers.token;
//         const user = await User.findOne({
//             where:{
//                 token : token 
//             }
//         })
//         const getOrder = await Order.findAll({
//             where:{
//                 id_customer : user.id,
//                 //status: 'Pending'|| 'Received' || 'Delivering' || 'Delivered'
//                 status: {
//                     [Op.or]: ['Pending' ,'Received', 'Delivering' , 'Delivered' ]
//                 }
//             }
//         })
//         if (getOrder.length <= 7) {
//             data = await Order.findAll({
//                 limit: 7,
//                 offset: 0,
//                 where:{
//                     id_customer : user.id,
//                     status: {
//                         [Op.or]: ['Pending' ,'Received', 'Delivering' , 'Delivered' ]
//                     }
//                 }
//             })
//         }
//         else{
//             data = await Order.findAll({
//                 limit: ((getOrder.length - page * 7) >= 0) ? 7 : getOrder.length % 7,
//                 offset: ((getOrder.length - page * 7) > 0) ? getOrder.length - page * 7 : 0,
//                 where:{
//                     id_customer : user.id,
//                     status: {
//                         [Op.or]: ['Pending' ,'Received', 'Delivering' , 'Delivered' ]
//                     }
//                 }
//             })
//         }
//         res.json({
//             code: 200,
//             status: 'OK',
//             totalPage: Math.ceil(getOrder.length / 7),
//             data: data.reverse()
//         })
//     }catch (err) {
//         console.log(err)
//         return res.json({
//             code: 500,
//             status: 'Internal Error',
//             message: 'Something went wrong'
//         })
//     }
// }
module.exports = {
    order,
    getcart,
    updateStatus,
    filterOrder,
    orderdetail,
    cancel
    // getOrderbyUser
}