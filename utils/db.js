const { Pool } = require('pg')
require('dotenv').config()

const connectionString = process.env.DB_URI
// const connectionString = `postgresql://postgres:${process.env.PASSWORD}@localhost:5432/ShoppingClothes`

const pool = new Pool({
    connectionString,
})

module.exports = pool;