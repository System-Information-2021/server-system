const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const db = require('./utils/db')
const path = require('path')

const app = express()
require('dotenv').config()


const { authorization } = require('./src/auth/auth.middleware')
const serviceRoute = require('./src/route/login.route')
// cor
app.use(cors({
  origin: '*'
}))

// Define routes 
const userRoute = require('./src/route/user.route')
const categoriesRoute = require('./src/route/categories.route')
const brandRoute= require('./src/route/brands.route')
const productRoute = require('./src/route/products.route')
const customerRoute = require('./src/route/customer.route')
const cartRoute= require('./src/route/cart.route')

// Use middleware 
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.use('/', serviceRoute)

app.use('/user', authorization , userRoute)

app.use('/category', authorization , categoriesRoute)

app.use('/brand', authorization ,brandRoute)

app.use('/product', authorization ,productRoute )

app.use('/customer', customerRoute)

app.use('/cart',cartRoute);

app.listen(process.env.PORT, async () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}`)
})





