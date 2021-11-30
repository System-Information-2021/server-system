const { QueryTypes } = require('sequelize');
const db = require('../../utils/db')
const order = require('../model/order.model')
const product = require('../model/product.model')
const order_detail = require('../model/order_detail.model')


const reportRevenue = async(req,res)=>{
    const id = req.params.id;
    console.log(id)
    let string;
    if (id == 1){
         string = `SELECT SUM(total_price),date_trunc('month', "createdAt") FROM tbl_orders where status ='delivered' GROUP by date_trunc('month', "createdAt") ORDER BY date_trunc('month', "createdAt")`;
    } else{
         string = `SELECT SUM(total_price),date_trunc('day', "createdAt") FROM tbl_orders where status ='delivered' GROUP by date_trunc('day', "createdAt") ORDER BY date_trunc('day', "createdAt")`;
    }
    const report = await db.query(string, {
        model: order,
        mapToModel: true // pass true here if you have any mapped fields
      });
    //onst report = await db.query("", { type: QueryTypes.SELECT });
    res.json({
        code : 200,
        message: "success",
        data: report.reverse(),
    })
}

const reportProduct  =async(req,res)=>{
    let string = `select sum( tod.quantity), tp."name" from tbl_orders too , tbl_orders_details tod , tbl_products tp where tod.id_product  =tp.id_product and too.id_order= tod.id_order and too.status='delivered' GROUP BY tp."name"`
    const report = await db.query(string ,{
        model : product , order_detail,
        mapToModel:true
    })
    res.json({
        code : 200,
        message: "success",
        data: report.reverse(),
    })
}

const reportOrder  =async(req,res)=>{
   // let string = "select sum( tod.quantity), tp.\"name\" from tbl_orders_details tod , tbl_products tp where tod.id_product  =tp.id_product GROUP BY tp.\"name\""
    let string ="select  to2.\"status\", count(to2.id_order), date_trunc('month', \"createdAt\")  from tbl_orders to2   GROUP by  to2.\"status\", date_trunc('month', \"createdAt\") ORDER BY date_trunc('month', \"createdAt\")"
    const report = await db.query(string ,{
        model : product , order_detail,
        mapToModel:true
    })
    res.json({
        code : 200,
        message: "success",
        data: report.reverse(),
    })
}

module.exports= {
    reportOrder,
    reportRevenue,
    reportProduct
}