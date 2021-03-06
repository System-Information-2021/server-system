const User = require('../model/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


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

    User.findAll()
        .then(listUsers => {
            listUsers.password = undefined;
            res.status(200).json({
                status: 'OK',
                code: 200,
                listUsers,
            });
        })
        .catch(Error => {
            if (!Error.status) {
                res.json({
                    message: 'Something went wrong!'
                })
            }
            next(Error);
        });
}


const register = async (req, res, next) => {
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


    // check email exist
    const userMatch = await User.findOne({
        where: {
            email: email
        }
    });

    if (!password || !email) {
        res.json({
            status: 'Bad Request',
            code: 400,
            message: 'Please fill all input fields'
        })
    } else {
        var error = []
        // validate email format
        var check_mail = ValidateEmail(email);
        if (!check_mail) {
            error.push('Wrong email format')
        }
        // Check existence of email input
        if (userMatch == null) {
            // Validate re-password of end-user
            if (!re_password) {
                error.push('Enter the repeat password input')
            } else if (re_password !== password) {
                error.push('Password does not match')
            }

            // Hash password processing
            const hash = await bcrypt.hash(password, 8)

            // Initialize User object
            const user = new User({
                password: hash,
                email: email,
                isadmin: false,
            })
            // Check if input has number phone and validate their format 
            if (mobile_number) {
                var check_phone = ValidatePhone(mobile_number);
                if (!check_phone) {
                    error.push('Enter number phone again')
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

            user.save()
                .then(results => {
                    if (results !== null) {
                        res.json({
                            status: 'Created',
                            code: 200,
                            message: 'Account create successully'

                        })
                    }
                    else {
                        res.json({
                            status: 'Internal Server Error',
                            code: 500,
                            message: 'Something went wrong'
                        })
                    }
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });


        }
        else {
            // If email does exist in db, return the message for ui and asks user entering again 
            return res.json({
                status: 'Bad Request',
                code: 400,
                message: 'Email does exist'
            })
        }

    }
};

const authentication = async (req, res) => {

    let { email, password } = req.body;
    if (!email || !password) {
        return res.json({
            status: 'Bad Resquest',
            code: 400,
            message: 'Please fill all input fields'
        })
    }
    // check email exist
    var userMatch = await User.findOne({
        where: {
            email: email
        },
    });
    try {
        if (ValidateEmail(email)) {
            //KT xem cai email hay khong
            if (userMatch == null) {
                return res.json({
                    status: 'Bad Request',
                    code: 400,
                    message: 'User does not exist'
                });
            }
            else {
                const matchPassword = await bcrypt.compare(password, userMatch.password);
                if (matchPassword) {
                    // Initialize token string to identify user when they login
                    var token =
                        jwt.sign({
                            id: userMatch.id,
                            email: userMatch.email
                        }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
                    // luu token
                    await userMatch.update({ token: token });
                    return res.json({
                        status: "OK",
                        code: 200,
                        token: token,
                        creat_at: new Date().toLocaleString(),
                        expire_at: new Date(Date.now() + 60000 * 60).toLocaleString()
                    })
                } else if (!matchPassword) {
                    return res.json({
                        status: 'Bad Request',
                        code: 400,
                        message: 'Wrong Password'
                    })
                }
            }

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
            message: 'Something went wronggggggggg'
        })
    }

}


const getUserByToken = async (req, res) => {
    if (!req.body.token) {
        return res.json({
            code: 400,
            status: 'Bad Request',
            message: 'User token is required'
        })
    }
    const token = req.body.token
    let userToken = await User.findOne({ where: { token: token } })

    if (userToken === null)
        res.json({
            code: 400,
            status: 'Bad Request',
            data: {
                tokenError: "not token for user"
            }
        })
    else {
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) {
                const { name, message, expiredAt } = err
                return res.json({
                    code: 400,
                    status: 'Bad Request',
                    message: name,
                    expiredAt: new Date(expiredAt).toLocaleString(),
                    currentTime: new Date().toLocaleString()
                })
            } else {
                userToken.password = undefined
                return res.json({
                    code: 200,
                    status: 'OK',
                    data: userToken
                })
            }
        });

    }


}


const changePassword = async (req, res) => {
    try {
        const { id } = req.params
        const {
            email,
            password,
            re_password
        } = req.body

        let isEmpty = email.trim()

        if(email.length == 0 || isEmpty == 0) {
            return res.json({
                code : 400, 
                status : 'Bad Request',
                message: 'Must provide the email or the email field must not be empty'
            })
        }

        if (email && !ValidateEmail(email)) {
            return res.json({
                code: 400,
                status: 'Bad Request',
                message: 'Wrong email format'
            })
        }

        let isEmptyPass = password.trim()
        let isEmptyReqass = re_password.trim()

        if(password.length != 0 && isEmptyPass != 0 && re_password.length != 0 && isEmptyReqass != 0) {
            let user = await User.findByPk(id)
            let isNotChange = await bcrypt.compare(password, user.password)

            if(isNotChange) {
                return res.json({
                    code : 400,
                    status : 'Bad Request',
                    message : "Please entering a new password"
                })
            }

            if (password === re_password) {
                let newHash = await bcrypt.hash(re_password, 8)
    
                await user.update({
                    email : email,
                    password: newHash
                })
                return res.json({
                    code: 200,
                    status: 'OK',
                    message: 'Change successfully'
                })
            } else {
                return res.json({
                    code: 400,
                    status: 'Bad Request',
                    message: 'Re-enter the password is not match'
                })
            }
    
        } else {
            return res.json({
                code : 400,
                status : 'Bad Request',
                message : 'Fill both of password and repeat password fields'
            })
        }

    } catch (err) {
        console.log(err)
        return res.json({
            code : 500,
            status : 'Internal Error',
            message : 'Something went wrong'
        })
    }
}

const updateUser = async (req,res) => {
    try {
        const {
            firstname,
            lastname,
            company,
            address,
            city,
            comment,
            mobile_number
        } = req.body

        const { id } = req.params
        let user = await User.findByPk(id)

        if(firstname !== user.firstname || 
            lastname !== user.lastname || 
            mobile_number !== user.mobile_number || 
            company !== user.company || 
            address !== user.address || 
            city !== user.city || 
            comment !== user.comment) {
            
            if(!ValidatePhone(mobile_number)) {
                return res.json({
                    code : 400, status : 'Bad Request', message : 'The number phone does not exist'
                })
            }

            if(address !== '' && !city) {
                return res.json({
                    code : 400, status : 'Bad Request', message : 'Must provide the city along with the address'
                })
            }

            await user.update({
                firstname : firstname,
                lastname : lastname,
                company : company,
                address : address,
                city : city,
                comment : comment,
                mobile_number : mobile_number
            })
            return res.json({
                code : 200,
                status : 'OK',
                message : 'Update Successfully'
            })
        } else {
            return res.json({
                code : 200,
                status : 'OK',
                message : 'Nothing has changed'
            })
        }
    } catch (err) {
        console.log(err) 
        return res.json({
            code : 500,
            status : 'Internal Error',
            message : 'Something went wrong'
        })
    }
}

module.exports = {
    getAllUsers,
    authentication,
    register,
    getUserByToken,
    changePassword,
    updateUser
}
