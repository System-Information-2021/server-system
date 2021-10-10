const bcrypt = require('bcrypt')
const User = require('../model/user.model')
const jwt = require('jsonwebtoken')


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

const register = async (req, res) => {
    const {
        firstname,
        lastname,
        password,
        email,
        mobile_number,
        re_password,
        company,
        comment,
        address,
        city } = req.body;

    //Validation fields 
    if (!password || !email) {
        res.json({
            status: 'Bad Request',
            code: 400,
            message: 'Please fill all fields'
        })
    } else {
        var error = []
        // validate email format
        var check_mail = ValidateEmail(email);
        if (!check_mail) {
            error.push('Wrong email format')
        }
        // Check existence of email input
        User.getUserByEmail(email, async (result) => {
            if (result === null) {
                return res.json({
                    status: 'Internal Server Error',
                    code: 500,
                    message: 'Something went wrong'
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
                    var check_phone = ValidatePhone(mobile_number);
                    if (!check_phone) {
                        error.push('Enter phone again')
                    } else {
                        user.mobile_number = mobile_number;
                    }
                }

                if (firstname && lastname) {
                    user.firstname = firstname;
                    user.lastname = lastname;
                }

                if (company) {
                    user.company = company;
                }
                // Check if input has address value, the city field must be enter following
                if (address) {
                    if (!city) {
                        error.push('No city')
                    } else {
                        user.address = address;
                        user.city = city;
                    }
                }

                if (comment) {
                    user.comment = comment;
                }
                // If any validations above has error, the function will return those errors and stop immediately
                if (error.length !== 0) {
                    return res.json({
                        status: 'Bad Request',
                        code: 400,
                        message: error
                    })
                }
                // console.log(user)
                // Save user infomation
                User.save((result) => {
                    if (result !== null) {
                        res.json({
                            status: 'Created',
                            code: 201,
                            message: 'Successully'
                        })
                    } else {
                        res.json({
                            status: 'Internal Server Error',
                            code: 500,
                            message: 'Something went wrong'
                        })
                    }
                }, user)
            } else {
                // If email does exist in db, return the message for ui and asks user entering again 
                return res.json({
                    status: 'Bad Request',
                    code: 400,
                    message: 'Email does exist'
                })
            }
        })


    }
}

const authentication = (req, res) => {
    var { email, password } = req.body;
    if (!email || !password) {
        return res.json({
            status: 'Bad Resquest',
            code: 400,
            message: 'Please fill all fields'
        })
    }

    try {
        if (ValidateEmail(email)) {
            User.getUserByEmail(email, async (result) => {
                if (result === undefined) {
                    return res.json({
                        status: 'Bad Request',
                        code: 400,
                        message: 'User does not exist'
                    });
                } else {
                    const matchPassword = await bcrypt.compare(password, result.password);

                    if (matchPassword) {
                        // Initialize token string to identify user when they login
                        var token =
                            jwt.sign({
                                id: result.id,
                                email: result.email
                            }, process.env.SECRET_KEY, { expiresIn: 60*60 });
                        // Delete password attribute while returning a user data 
                        delete result.password
                        return res.header('auth-token', token).json({
                            status: "OK",
                            code: 200,
                            data: result,
                            token: token,
                            creat_at: new Date().toLocaleString(),
                            expire_at: new Date(Date.now() + 3600000).toLocaleString()
                        })
                    } else if (!matchPassword) {
                        return res.json({
                            status: 'Bad Request',
                            code: 400,
                            message: 'Wrong Password'
                        })
                    }
                }
            });
        } else {
            return res.json({
                status: 'Bad Request',
                code: 400,
                message: 'Wrong email format'
            })
        }
    } catch (error) {
        return res.json({
            status: 'Internal Server Error',
            code: 500,
            message: 'Something went wrong'
        })
    }


}


module.exports = {
    register,
    authentication
}