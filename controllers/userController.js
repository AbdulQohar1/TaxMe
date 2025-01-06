const { StatusCodes } = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/authentication');
const upload = require('../utilis/cloudinaryConfig');
const User = require('../models/user'); 

const updateProfilePicture = async (req , res) => {
  try {

    const { useremail, token } = req.headers;


    if (!useremail || !token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide user email and token in headers.'
      })
    };

    // verify the provided token
    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check if email matches token
    if (email != decoded.email) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials; email and token mismatch'
      });
    }
    
    // find user 
    const user = await  User.findOne({ email});
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found.'
      });
    }

    // delete old profile picture  from cloudinary if it exists
    if (user.profilePicture) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];
      
      await cloudinary.uploader.destroy(publicId);
    };

    // upload new profilepicture
    const result = await cloudinary.uploader.u

    // // get current user id from auth middleware
    // const userId = req.user.id;

    // // upload to cloudinary
    // const result  = await cloudinary.uploader.upload(req.file.path, {
    //   folder: 'profile-pictures',
    //   crop: 'fill',
    //   gravity: 'face'
    // });

    // // update user profile in database with image s
  } 
  catch (error) {

  }
}



const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ success: false, error: 'Error fetching users' });
  }
};

module.exports = { getAllUsers };