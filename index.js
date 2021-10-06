const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { Client, Pool } = require('pg')
require('dotenv').config()


// Define routes 
const userRoute = require('./src/route/user.route')

// Use middleware 
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/user', userRoute)

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PBPORT,
  ssl: { rejectUnauthorized: false }
})

pool.connect(err => {
  if (err) {
    console.error('error connecting', err.stack)
  } else {
    console.log('connected')
    pool.end()
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}`)
})

