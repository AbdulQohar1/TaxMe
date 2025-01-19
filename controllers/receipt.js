const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');

const getReceipt = async (req, res) => {
  try {
    // get user's email and token in headers
    const { email, authorization } = req. headers;

    // validate if user credentials are provided in the headers
    const token =  authorization.split(' ')[1];

    if (!email , !token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Failed to provide email and token in headers.'
      }); 
    }

    // find user with the provided email
    const user = await User.findOne({ email});

    // check if user exists
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found.',
      });
    }

    // validate the provided token 
    const decoded = jwt.verify(token , process.env.JWT_SECRET);

    // check if email matches the provided token
    if (email !== decoded.email) {
      return  res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials; email and token mismatch.'
      });
    }

  } catch (error) {
    
  }
}