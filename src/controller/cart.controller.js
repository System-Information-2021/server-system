
const Product = require('../model/product.model')
const Order = require('../model/order.model')
const Order_detail= require('../model/order_detail.model')
const AddtoCart = async(req,res)=>{
   try{
    var productId = req.params.id;
    const product = await Product.findByPk(productId);
    if(product!==null){
        if( req.session.cart == undefined ){
            req.session.cart = [];
            req.session.cart.push({
                item: productId,
                qty:1,
                price: parseFloat(product.price).toFixed(2)
            })
        }else{
            var cart = req.session.cart;
            var newItem = true;
            for (var i=0; i<cart.length;i++){
                if(cart[i].item == productId){
                    cart[i].qty++;
                    cart[i].price =parseFloat( cart[i].qty) *parseFloat( product.price)
                    newItem = false;
                    break;
                }
            }
            if(newItem){
                cart.push({
                    item: productId,
                    qty: 1,
                    price: parseFloat(product.price).toFixed(2)
                });
            }
        }
        res.json({
            code: 200,
            status: 'Added',
            message: 'Successfully'
        })
        console.log(req.session.cart);
    }else{return res.json({
        code: 400,
        status: 'Bad Request',
        message: 'Product does exist'
    })}
   } catch (err) {
    console.log(err)
    res.json({
        code: 500,
        status: 'Internal Error',
        message: 'Something went wrongssss'
    })
}
}
const getCart =  async(req,res)=>{
    try{
        let totalqty= 0;
        if(req.session.cart ){
            let cart=req.session.cart;
            for(var i =0; i<cart.length; i++){
                totalqty= totalqty + cart[i].qty;
            }
            return res.json({
                code: 200,
                status: 'successfully',
                message:'get cart successfully',
                totalqty: totalqty,
                data: req.session.cart
            })
        }else{
            return res.json({
                code: 200,
                status: 'successfully',
                message: 'have no product is added',
                totalqty: totalqty,       
            })
        }
    }catch (err) {
        console.log(err)
        res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrongssss'
        })
    }
}
const deleteCart = async(req,res)=>{
    try{
        let productId = req.params.id;
        if(req.session.cart){
            let cart=req.session.cart;
            //check product valid?
            var check= 0;
            for(var i =0; i<cart.length; i++){
                if(productId == cart[i].item){
                    check++
                }
            }
            console.log('check = '+check);
            if(check === 0){
                return res.json({
                    code: 400,
                    status: 'Bad Request',
                    message: 'Product does exist'
                })
            }
            //
            for(var i =0; i<cart.length; i++){
            if(cart[i].item == productId){
                await delete cart[i];
                }
            }
            //xoa value null khoi array
            req.session.cart=cart.filter((a) => a);
            if(req.session.cart.length <1){
                req.session.destroy();
            }
            else{
                console.log("/////")
            }
            return res.json({
                code: 200,
                status: 'successfully',
                message: 'delete successfully'
            })
            }else{
                res.json({
                    code: 200,
                    status: 'successfully',
                    message: 'cart does not exist'
                })
        }       
    }catch (err) {
        console.log(err)
        res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrongssss'
        })
    }
}
const deleteCartAll= async(req,res)=>{
    if(req.session.cart){
        req.session.destroy();
        return res.json({
            code: 200,
            status: 'successfully',
            message: 'Deleted All'
        })
    }else{
        res.json({
            code: 200,
            status: 'successfully',
            message: 'have no product is added',
        })
    }

}
const increaseqty = async(req,res)=>{
    try{
        let productId = req.params.id;
        if(req.session.cart){
            let cart = req.session.cart;
            //check product valid?
            var check= 0;
            for(var i =0; i<cart.length; i++){
                if(productId == cart[i].item){
                    check++
                }
            }
            console.log('check = '+check);
            if(check === 0){
                return res.json({
                    code: 400,
                    status: 'Bad Request',
                    message: 'Product does exist'
                })
            }
            //
            for(var i =0; i<cart.length; i++){
                if(cart[i].item == productId){
                        cart[i].qty ++
                    }
                }
            res.json({
                code: 200,
                status: 'successfully',
                message: 'increased successfully'
            })   

        }else{
            return res.json({
                code: 200,
                status: 'successfully',
                message: 'cart does not exist'   
            })
        }
    }catch (err) {
        console.log(err)
        res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrongssss'
        })
    }
}
const decreaseqty = async(req,res)=>{
    try{
        let productId = req.params.id;
        if(req.session.cart){
            let cart = req.session.cart;
            //check product valid?
            var check= 0;
            for(var i =0; i<cart.length; i++){
                if(productId == cart[i].item){
                    check++
                }
            }
            console.log('check = '+check);
            if(check === 0){
                return res.json({
                    code: 400,
                    status: 'Bad Request',
                    message: 'Product does exist'
                })
            }
            //
            for(var i =0; i<cart.length; i++){
                if(cart[i].item == productId){
                    if(cart[i].qty=== 1){
                        return res.json({
                            code: 200,
                            status: 'successfully',
                            message: 'khong the giam duoc nua'
                        })
                    }
                    cart[i].qty --
                       
                    }
                }
            res.json({
                code: 200,
                status: 'successfully',
                message: 'decreased successfully'
            })   

        }else{
            return res.json({
                code: 200,
                status: 'successfully',
                message: 'cart does not exist'
            })
        }
    }catch (err) {
        console.log(err)
        res.json({
            code: 500,
            status: 'Internal Error',
            message: 'Something went wrongssss'
        })
    }
}

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
            console.log(data[i].id_product);
            console.log(data[i].qty);
            console.log(data[i].total_detail);
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
module.exports = {
    AddtoCart,
    getCart,
    deleteCart,
    deleteCartAll,
    increaseqty,
    decreaseqty,
    order,
}