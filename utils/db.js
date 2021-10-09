const { Client, Pool } = require('pg')
require('dotenv').config()

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
        console.log('Successfully connected')
    }
})

module.exports = pool;