require('dotenv').config()
const { Sequelize } = require('sequelize');
  const db = new Sequelize({
    database: process.env.PGDATABASE,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // <<<<<<< YOU NEED THIS
          }
    },
  });

db.authenticate()
  .then(()=> console.log('Connect successfully'));

module.exports = db;