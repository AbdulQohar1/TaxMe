const express = require('express');
const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const router = express.Router();

// router.post('/register' , register);
router.post('/register', async (req , res) =>{
    // const user = await User.create({ ...req.body });

	// const token = user.createToken();
	// res.status(StatusCodes.CREATED).json({ 
	// 	user: {email: user.email}, 
	// 	token
	// });
	try {
		const user = await User.create({ ...req.body });

		// Assuming createToken is a method on the User model
		const token = user.createToken();

		res.status(StatusCodes.CREATED).json({
			user: { email: user.email },
			token
		});
	} catch (error) {
		console.error("Error during registration:", error); // Log the full error for debugging
		res.status(StatusCodes.BAD_REQUEST).json({ err: error.message || "Something went wrong" });
	}
})

// router.post('/login' , login);
router.post('/login' , async (req , res) => {
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
})

// router.post('/getUserProfile' , getUserProfile)
router.post('/getUserProfile' , async (req , res) => {
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
		next();
  } catch (error) {
    console.log('Error verifying:', error);
    (error);  // Pass error to Express error handler
  }
})
module.exports = router;