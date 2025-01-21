const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Receipt =require('../models/receipt');
const { StatusCodes } = require('http-status-codes');

const createReceipt = async( req , res) => {
  try {
    // get user's email & token from headers
    const { email , authorization } = req.headers;
    
    // validate if user credentials are provided in the headers
    const token =  authorization.split(' ')[1];

    if (!email , !token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email and token are required in headers.'
      }); 
    }

    // find and validate user
    const user = await User.findOne({email});

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found.'
      });
    }

    // validate token
    const decoded = jwt.verify(token , process.env.JWT_SECRET);

    // check if email matches the provided token
    if (email !== decoded.email) {
      return  res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials; email and token mismatch.'
      });
    }
    
    // get title from request body
    const { title } = req.body;

    if (!title) {
      return req.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide receipt title.'
      })
    };

    // create new receipt
    const newReceipt = await Receipt.create({
      title,
      owner_id: user._id,
    });

    // fetch the created receipt with populated owner info
    const receipt = await Receipt.findById(newReceipt._id).populate('owner_id', 'fullname _id');

    // response/data format
    const formattedReceipt = {
      title: receipt.title,
      owner_info: {
        fullname: receipt.owner_id.fullname,
        user_id: receipt.owner_id._id
      },
      receipt_date: receipt.receipt_date
    };

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Receipt created successfully.',
      receipt: formattedReceipt,
    });

  } catch (error) {
    console.log('Error creating receipt: ', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create receipt.'
    })  
  }
}

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
    const receipts = await Receipt.findOne({ owner_id: user._id})
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
      message: 'Failed to fetch receipt'
    })
  }
};

module.exports = {
  getReceipts,
  createReceipt,
}