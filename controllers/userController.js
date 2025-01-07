const { StatusCodes } = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/authentication');
const upload = require('../utilis/cloudinaryConfig');
const User = require('../models/user'); 

const updateProfilePicture = async (req , res) => {
  try {
    // extract user credentials from headers
    const { useremail, token } = req.headers;

    // validate require headers
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
    
    // find user in database
    const user = await  User.findOne({ email: useremail});
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found.'
      });
    };

    // Validate file upload
    if (!req.file ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Profile picture upload failed. File missing.',
      });
    }

    // delete old profile picture  from cloudinary if it exists
    if (user.profilePicture) {
      // extract public ID of the pfp from cloudinary uing regex
      const publicId = user.profilePicture.match(/\/([^\/]+)$/)?.[1]?.split('.')[0];

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    };

    // upload new image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile-pictures',
    });

    // update user profile with new image url
    user.profilePicture = result.secure_url;
    await user.save();

    // send success response
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Pfp uploaded successfully.',
      profilePicture: user.profilePicture,
    })

  } 
  catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error uploading profile picture...',
      error: error.message,
    })
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


    // upload new profilepicture
    const result = await cloudinary.uploader.upload()

    // // get current user id from auth middleware
    // const userId = req.user.id;

    // // upload to cloudinary
    // const result  = await cloudinary.uploader.upload(req.file.path, {
    //   folder: 'profile-pictures',
    //   crop: 'fill',
    //   gravity: 'face'
    // });