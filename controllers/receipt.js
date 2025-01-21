const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Receipt =require('../models/receipt');
const { StatusCodes } = require('http-status-codes');
const receipt = require('../models/receipt');

const getReceipts = async (req, res) => {
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

    // get receipt for the user
    const receipts = await s.findOne({ owner_id: user._id})
      .populate('owner_id', 'fullname _id');

    const formattedReceipt = receipts.map(receipt => ({
      title: receipt.title,
      owner_info: {
        fullname: receipt.owner_id.fullname,
        user_id: receipt.owner_id._id
      },
      receipt_date: receipt.receipt_date
    }));

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Receipt retrieved successfully.',
      receipt: formattedReceipt
      // data: 
    })

  } catch (error) {
    return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch receipts'
    })
  }
}