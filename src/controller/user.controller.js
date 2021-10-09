const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user.model')

const ValidateEmail = (mail) => {
    var mailformat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!mail.match(mailformat)) {
        return false;
    } else {
        return true;
    }
}

const ValidatePhone = (phone) => {
    var phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phone.match(phoneNum)) {
        return false
    } else {
        return true
    }
}

const getAllUsers = (req, res) => {
    User.getAllUsers((data) => {
        if (data !== null) {
            res.json({
                status: 'ok',
                code: 200,
                userList: data
            }).status(200)
        } else {
            res.json({
                message: 'Something went wrong!'
            })
        }
    })
}

const createUser = async (req, res) => {
    const { 
        firstname,
        lastname, 
        password, 
        email, 
        mobile_number, 
        re_password , 
        company , 
        comment , 
        address , 
        city } = req.body;

    //Validation fields 
    if (!password || !email) {
        res.json({ message: 'Please fill all fields' })
    } else {
        var error = []
        // validate email format
        var check_mail = ValidateEmail(email, res);
        if (!check_mail) {
            error.push('Wrong email format')
        }
        // Check existence of email input
        User.getUserByEmail(email, async (result) => {
            if (result === null) {
                return res.json({
                    message: 'Something went wrong !'
                })
            }
            if (result === undefined) {
                // Validate re-password of end-user
                if (!re_password) {
                    error.push('Enter the re-password')
                } else if (re_password !== password) {
                    error.push('Password does not match')
                }

                // Hash password processing
                const hash = await bcrypt.hash(password, 8)

                // Initialize User object
                const user = new User({
                    password: hash,
                    email: email
                })
                // Check if input has number phone and validate their format 
                if (mobile_number) {
                    var check_phone = ValidatePhone(mobile_number, res);
                    if (!check_phone) {
                        error.push('Enter phone again')
                    } else {
                        user.mobile_number = mobile_number;
                    }
                }

                if(firstname && lastname) {
                    user.firstname = firstname;
                    user.lastname = lastname;
                }

                if(company) {
                    user.company = company;
                }
                // Check if input has address value, the city field must be enter following
                if(address) {
                    if(!city) {
                        error.push('No city')
                    } else {
                        user.address = address;
                        user.city = city;
                    }
                }

                if(comment) {
                    user.comment = comment;
                }
                // If any validations above has error, the function will return those errors and stop immediately
                if (error.length !== 0) {
                    return res.json(error)
                }
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
                // If email does exist in db, return the message for ui and asks user entering again 
                return res.json(
                    [
                        'Email does exist'
                    ]
                )
            }
        })


    }
}

const authentication = (req, res) => {
    var { email, password } = req.body;
    if (!email || !password) {
        return res.status(500).json({ message: 'Please fill all fields' })
    }

    var promise = new Promise((resolve, reject) => {
        User.getUserByEmail(email, async (result) => {
            if (result === undefined) {
                return res.status(500).json({ message: 'User does not exist' });
            }
            resolve(result);
        });
    });

    promise.then(async (userMatch) => {
        const matchPassword = await bcrypt.compare(password, userMatch.password);

        if (matchPassword) {
            var key;
            if(userMatch.isadmin) {
                key = process.env.MANAGER_KEY
            } else {
                key = process.env.CLIENT_KEY
            }

            // Initialize token string to identify user when they login
            var token =
                jwt.sign({
                    id: userMatch.id,
                    email: userMatch.email
                }, key , { expiresIn: 60*60 });
            return res.header('auth-token', token).json({
                status : "ok",
                code : 200,
                user: userMatch,
                token: token,
                creat_at: new Date().toString(),
                expire_at : new Date((Math.floor(Date.now() / 1000) + 3600)).toString() 
            })
        }
        return res.json({ message: 'Wrong Password' })
    })
        .catch((error) => {
            console.log(error)
        })
}

const authorization = (req, res, next) => {
    const token = req.header('auth-token');


    if (!token) return res.status(401).send('Access Denied');

    try {
        if(req.header('isadmin')) {
            const isadmin = req.header('isadmin');
            if(isadmin) {
                const verified = jwt.verify(token, process.env.MANAGER_KEY);
            } else if(!isadmin) {
                const verified = jwt.verify(token, process.env.CLIENT_KEY);
            }
        }
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