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
// Take function register from controller
const { getUserByToken, register } = require('./src/controller/user.controller')

// Use middleware 
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.use('/', serviceRoute)

app.use('/user', authorization , userRoute)

app.use('/register' , register)

app.use('/get-user-by-token',getUserByToken)

app.use('/category', categoriesRoute)

app.use('/brand', brandRoute)

app.use('/product', productRoute )

app.use("/uploads", express.static(path.resolve(__dirname, 'uploads')));

app.listen(process.env.PORT, async () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}`)
})


