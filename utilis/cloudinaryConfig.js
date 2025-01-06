const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,       
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});

// Log environment variables to check their values
// console.log(cloudinary.config());

module.exports = cloudinary;
