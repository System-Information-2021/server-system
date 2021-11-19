const { QueryTypes } = require('sequelize');
const db = require('../../utils/db')
const order = require('../model/order.model')
const product = require('../model/product.model')
const order_detail = require('../model/order_detail.model')


const reportRevenue = async(req,res)=>{
    let string = "SELECT SUM(total_price),date_trunc('month', \"createdAt\") FROM tbl_orders GROUP by date_trunc('month', \"createdAt\") ORDER BY date_trunc('month', \"createdAt\")";

    const report = await db.query(string, {
        model: order,
        mapToModel: true // pass true here if you have any mapped fields
      });
    //onst report = await db.query("", { type: QueryTypes.SELECT });
    res.json({
        code : 200,
        message: "success",
        data: report,
    })
}

const reportProduct  =async(req,res)=>{
    let string = "select sum( tod.quantity), tp.\"name\" from tbl_orders_details tod , tbl_products tp where tod.id_product  =tp.id_product GROUP BY tp.\"name\""
    const report = await db.query(string ,{
        model : product , order_detail,
        mapToModel:true
    })
    res.json({
        code : 200,
        message: "success",
        data: report,
    })
}



module.exports= {
    reportRevenue,
    reportProduct
}