const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
// const bcrypt = require('bcryptjs');

const register = async (req , res) => {
	const user = await User.create({ ...req.body });

	const token = user.createToken();
	res.status(StatusCodes.CREATED).json({ 
		user: {email: user.email}, 
		token
	});
}

// user login handler
const login = async (req , res) => {
	const { email, password} = req.body;

	// check if user credentials is provided
	if (!email || !password) {
		throw new BadRequestError('Please provide email and password')
	};

	const user = await User.findOne({ email});
	if (!user) {
		throw new UnauthenticatedError('Invalid Credentials')
	};

	// compare the provided password and user password
	const passwordVerification = await user.comparePassword(password);

	if (!passwordVerification) {
		throw new UnauthenticatedError('Invalid Credentials...')
	};
    
	const token = user.createToken();

	res.status(StatusCodes.OK).json({
		user: {email: user.email},
		token
	});
}

// get User profile handler
const getUserProfile = async (req, res, next) => {
  const { email, token } = req.headers;  // Changed from req.header to req.headers

  try {
    const user = await User.findOne({ usermail: email, usertoken: token });

    if (!user) {
      throw new UnauthenticatedError('Invalid Credentials');
    }

    req.user = user;
    
    // Send response or call next() to pass control to the next middleware
    res.json({
      user_details: {
        user_id: user._id,
        user_status: user.status,
        user_role: user.role,
        email: user.usermail
      }
    });
  } catch (error) {
    console.log('Error verifying:', error);
    next(error);  // Pass error to Express error handler
  }
};





module.exports = {
	register, 
	login,
	getUserProfile,
}