const jwt = require('jsonwebtoken')

const authorization = (req, res, next) => {
    const token = req.header('token');

    if (!token) return res.status(401).json({ status : 'Unauthorized', code : 401, message : 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (err) {
        return res.status(400).json({ status : 'Bad Request', code : 400 , message : 'Invalid Token' });
    }
}

module.exports = {
    authorization
}