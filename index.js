const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

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

// Use middleware 
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.use('/', serviceRoute)

app.use('/user', authorization , userRoute)

app.listen(process.env.PORT, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}`)
})

