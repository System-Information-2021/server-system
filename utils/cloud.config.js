const cloudinary = require('cloudinary')
require('dotenv').config()

const { 
    CLOUD_NAME,
    API_KEY,
    API_SECRET
 } = process.env

cloudinary.v2.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

module.exports = cloudinary;