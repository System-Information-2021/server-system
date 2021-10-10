const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../model/user.model')

const authentication = (req, res) => {
    var { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            status : 'Bad Resquest',
            code : 400,
            message: 'Please fill all fields' })
    }

    var promise = new Promise((resolve, reject) => {
        User.getUserByEmail(email, async (result) => {
            if (result === undefined) {
                return res.status(400).json({
                    status : 'Bad Request',
                    code : 400,
                    message: 'User does not exist' 
                    });
            }
            resolve(result);
        });
    });

    promise.then(async (userMatch) => {
        const matchPassword = await bcrypt.compare(password, userMatch.password);

        if (matchPassword) {

            // Initialize token string to identify user when they login
            var token =
                jwt.sign({
                    id: userMatch.id,
                    email: userMatch.email
                }, process.env.SECRET_KEY , { expiresIn: 60 });
            // Delete password attribute while returningf a user data 
            delete userMatch.password    
            return res.header('auth-token', token).json({
                status : "OK",
                code : 200,
                data: userMatch,
                token: token,
                creat_at: new Date().toLocaleString(),
                expire_at : new Date(Date.now() + 60000).toLocaleString() 
            })
        }
        return res.json({
             status: 'Bad Request',
             code : 400,
             message : 'Wrong Password'
             })
    })
        .catch((error) => {
            console.log(error)
            return res.json({
                status : 'Internal Server Error',
                code : 500,
                message : 'Something went wrong'
            })
        })
}

const authorization = (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) return res.status(401).json({ status : 'Unauthorized', code : 401, message : 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (err) {
        return res.status(400).json({ status : 'Bad Request', code : 400 , message : 'Invalid Token' });
    }
}

module.exports = {
    authentication,
    authorization
}