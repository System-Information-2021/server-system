const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user.model')

const ValidateEmail = (mail) => {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (mail.match(mailformat)) {
        return "Valid email address!";
    }
    else {
        return "You have entered an invalid email address!";
    }
}


const getAllUsers = (req, res) => {
    User.getAllUsers((data) => {
        if (data !== null) {
            res.json({
                data: data
            }).status(200)
        } else {
            res.json({
                message: 'Something went wrong !'
            })
        }
    })
}

const createUser = async (req, res) => {
    const { name, username, password } = req.body;

    //Validation fields 
    if (!name || !username || !password) {
        res.json({ message: 'Please fill all fields' })
    } else {
        var check_mail = ValidateEmail(username);
        if (check_mail !== 'Valid email address!') {
            res.json({ message: check_mail })
        } else {
            User.getUserByUsername(username, async (result) => {
                if (result === null) {
                    return res.json({
                        message: 'Something went wrong !'
                    })
                }
                if (result === undefined) {
                    // Hash password processing
                    const hash = await bcrypt.hash(password, 8)

                    // Initialize User object
                    const user = new User({
                        name: name,
                        username: username,
                        password: hash
                    })

                    // console.log(user)
                    // Save user infomation
                    User.save((result) => {
                        if (result !== null) {
                            res.json({
                                message: 'Successfully !'
                            })
                        } else {
                            res.json({
                                message: 'Something went wrong !'
                            })
                        }
                    }, user)
                } else {
                    return res.json({
                        message: 'Username does exist'
                    })
                }
            })
        }
    }
}

const authentication = (req,res) => {
    var { username, password } = req.body;
	if(!username || !password) {
		return res.status(500).json({ message: 'Please fill all fields' })
	}

	var promise = new Promise((resolve,reject)=> {
		User.getUserByUsername(username, async (result) => {
			if(result === undefined) {
				return res.status(500).json({ message: 'User does not exist' });
			} 
			resolve(result);
		});
	});
	
	promise.then(async(userMatch)=> {
		const matchPassword = await bcrypt.compare(password, userMatch.password);
	
		if(matchPassword) {
			var token = 
            jwt.sign({id: userMatch.id,
                     username : userMatch.username
                    }, process.env.SECRET_KEY);
			var at = new Date();
			var message = 'Login with ' + username;
			return res.header('auth-token', token).json({
				message : message,
				token : token,
                at : at
			})
		} 
		return res.json({message : 'Wrong Password'})
	})
	.catch((error)=>{
		console.log(error)
	}) 
} 

const authorization = (req,res,next) => {
    const token = req.header('auth-token');

    
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        next();
        // res.status(200).send('Accessed')
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }
}

module.exports = {
    getAllUsers,
    createUser,
    authentication,
    authorization
}