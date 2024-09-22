const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const router = express.Router();

// router.post('/register' , register);
router.post('/register', async (req , res) =>{
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
		};
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
router.get('/get-profile' , async (req , res) => {
	try {
    // Extract useremail and usertoken from headers
    const { email, token } = req.headers;  
    console.log('Headers received:', req.headers);

    // Verify if useremail and usertoken are provided
    if (!email || !token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        err: 'User email or token is missing'
      });
    }

    // Verify the token using the private key
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(StatusCodes.UNAUTHORIZED).json({ err: 'Invalid token!' });
    }

    // If decodedToken is not found, return error
    if (!decodedToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ err: 'Invalid token!' });
    }

    console.log('Decoded token:', decodedToken);

    // Find user in the database by email
    const user = await User.findOne({ email: email });

    if (!user) {
      console.error('User not found for email:', email);
      return res.status(StatusCodes.NOT_FOUND).json({ err: 'User not found' });
    }

    // Return the user profile information
    res.status(StatusCodes.OK).json({
      user_details: {
        user_id: user._id,
        user_status: user.status || 'active', // Assuming user status is stored in `status`
        user_role: user.role || 'user', // Assuming user role is stored in `role`
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error in /get-profile route:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({ err: 'Invalid token!' });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err: 'Something went wrong', details: error.message });
  }
}


	// // extract useremail and usertoken from headers
  // const {email,token} = req.headers;  
	// console.log('Headers received:', req.headers);

	// // verify if useremail and usertoken are provided
	// if (!email || !token) {
	// 	return res.status(StatusCodes.UNAUTHORIZED).json({
	// 		err: 'User email or token is missing'
	// 	});
	// }

	// // verify the token using the private key
	// let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

	// if (!decodedToken) {
	// 	return res.status(StatusCodes.UNAUTHORIZED).json({err: 'Invalid token!'})
	// }

	// if (!user) {
	// 	return res.status(StatusCodes.NOT_FOUND).json({ err: 'User not found' });
	// }

	// // find user in the database by email
	// const user = await User.findOne({ email: email});

	// if (!user) {
	// 	return res.status(StatusCodes.NOT_FOUND).json({ err: 'User not found' });
	// }

	// res.status(StatusCodes.OK).json({
	// 	user_details: {
	// 		user_id: user._id,
	// 		user_status: user.status || 'active', // Assuming user status is stored in `status`
	// 		user_role: user.role || 'user', // Assuming user role is stored in `role`
	// 		email: user.email
	// 	}
	// });
  // try {
  //   const user = await User.findOne({ usermail: email, usertoken: token });

  //   if (!user) {
  //     throw new UnauthenticatedError('Invalid Credentials');
  //   }

  //   req.user = user;
    
  //   // Send response or call next() to pass control to the next middleware
  //   res.json({
  //     user_details: {
  //       user_id: user._id,
  //       user_status: user.status,
  //       user_role: user.role,
  //       email: user.usermail
  //     }
  //   });
	// 	next();
  // } catch (error) {
  //   console.log('Error verifying:', error);
  //   (error);  // Pass error to Express error handler
  // }
)
module.exports = router;