const express = require('express')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config()

// cor
app.use(cors({
  origin: '*'
}))


// Define routes 
const userRoute = require('./src/route/user.route')

// Use middleware 
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("server is running")
})
app.use('/user', userRoute)

app.listen(process.env.PORT, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}`)
})

