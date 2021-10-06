const shortid = require('shortid')
const pool = require('../../utils/db')

var User = function(user) { 
    this.id = shortid.generate();
    this.name = user.name;
    this.username = user.username;
    this.password = user.password;
} 

// Create 
User.save = (result,user) => {
  pool.connect((err,client,done) => {
    if(err) throw err
    const {id, name , username , password } = user;
    const query = {
      text : `INSERT INTO users(id ,name ,username ,password)
      VALUES($1 ,$2, $3, $4)`,
      values : [id, name , username, password]
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
        client.query('SELECT * FROM users', (err, res) => {
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
// Get User by id
User.getUserById = (user_id, result) => {
  pool.connect((err, client, done) => {
    if (err) throw err
    const query = {
      text : `SELECT * FROM users WHERE id=$1`,
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

// Get User by username
User.getUserByUsername = (username, result) => {
  pool.connect((err, client, done) => {
    if (err) throw err
    const query = {
      text : `SELECT * FROM users WHERE username=$1`,
      values : [username]
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
// Get User by name
User.getUserByName = (name, result) => {
  pool.connect((err, client, done) => {
    if (err) throw err
    const query = {
      text : `SELECT * FROM users WHERE name=$1`,
      values : [name]
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