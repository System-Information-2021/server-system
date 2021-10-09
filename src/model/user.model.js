const shortid = require('shortid')
const pool = require('../../utils/db')

var User = function(user) { 
    this.email = user.email;
    this.firstname = null;
    this.lastname = null;
    this.password = user.password;
    this.mobile_number = null;
    this.isadmin = true;
    this.address = null;
    this.city = null;
    this.comment = null;
    this.company = null;
} 

// Create 
User.save = (result,user) => {
  pool.connect((err,client,done) => {
    if(err) throw err
    const { email , firstname , lastname , password ,isadmin , mobile_number , address, city , company , comment } = user;
    const query = {
      text : `INSERT INTO tbl_user(email , firstname , lastname , password, isadmin , mobile_number , address , city , company , comment)
      VALUES($1 ,$2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      values : [email, firstname , lastname, password, isadmin ,mobile_number , address, city , company , comment]
    } 
    
    client.query(query, (err,res)=> {
      done()
      if(err) {
        console.log(err.stack)
        result(null)
      } else {
        result(res) 
      }
    })
  })
} 
// Update

// Get all user
User.getAllUsers = (result) => {
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT * FROM tbl_user', (err, res) => {
          done()
          if (err) {
            console.log(err.stack)
            result(null)
          } else {
            console.log(res.rows)
            result(res.rows)
          }
        })
      })
}
// Get User by id
User.getUserById = (user_id, result) => {
  pool.connect((err, client, done) => {
    if (err) throw err
    const query = {
      text : `SELECT * FROM tbl_user WHERE id=$1`,
      values : [user_id]
    }
    client.query(query, (err, res) => {
      done()
      if (err) {
        console.log(err.stack)
        result(null)
      } else {
        console.log(res.rows[0])
        result(res.rows[0])
      }
    })
  })
}
// Check existence of user input

// Get User by email
User.getUserByEmail = (email, result) => {
  pool.connect((err, client, done) => {
    if (err) throw err
    const query = {
      text : `SELECT * FROM tbl_user WHERE email=$1`,
      values : [email]
    }
    client.query(query, (err, res) => {
      done()
      if (err) {
        console.log(err.stack)
        result(null)
      } else {
        console.log(res.rows[0])
        result(res.rows[0])
      }
    })
  })
}

module.exports = User;