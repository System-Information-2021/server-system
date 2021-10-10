const User = require('../model/user.model')

const getAllUsers = (req, res) => {
    User.getAllUsers((data) => {
        data.forEach(element => {
            delete element.password
        });
        if (data !== null) {
            res.json({
                status: 'OK',
                code: 200,
                data: data
            }).status(200)
        } else {
            res.json({
                message: 'Something went wrong!'
            })
        }
    })
}


module.exports = {
    getAllUsers
}