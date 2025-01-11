const User = require('../models/user'); 
const OTP = require('../models/otp');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const bcrypt = require('bcryptjs');

const register = async (req , res) => {
	try {

		const { fullname, email, password, role, otp} = req.body;
		// check if all necessary details are provided 
		if (!fullname || !email || !password || !otp) {
			return res.status(StatusCodes.FORBIDDEN).json({
				success: false,
				message: 'All fields are required!'
			})
		};
	
		// check if user already exists
		const existingUser = await User.findOne({ email});
		if (existingUser) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'User already exists',
			});
		};
	
		// find the most recent otp received by a user 
		const response = await OTP.find({ email}).sort({ createdAt: -1 }).limit(1);
			
		if (response.length === 0) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'The provided OTP is not valid',
			});
		}
	
		const savedOtp = response[0].otp;
	
		// Compare the provided OTP with the hashed OTP from the database
		const isOtpValid = await bcrypt.compare(otp.toString(), savedOtp);
	
		if (!isOtpValid) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'The provided OTP is not valid',
			});
		}
	
		// if OTP is valid, create the user
		const user = await User.create({ ...req.body });
	
		// generate a token for the user
		const token = user.createToken();
		res.status(StatusCodes.CREATED).json({ 
			user: {email: user.email}, 
			token
		});
	} catch (error) {
		// Log the full error for debugging
		console.error("Error during registration:", error);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: 'An error occurred during registration.',
			error: error.message || 'Internal Server Error',
		});
	}
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
  // Extract useremail and usertoken from headers
	const { email, token } = req.headers;  

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
    (error);  
  }
};

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json({ success: true, data: users });
	} catch (error) {
		res.status(500).json({ success: false, error: 'find user error' });

	}
};

const logoutUser =  async ( req, res) => {
	const blacklist = [];

	try {
		// get the token from headers
		const token =  req.headers['access_token'];

		if (!token) {
			return  res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				message: 'Access token is required.'
			})
		};

		// verify token
		if  (blacklist.includes(token)) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				message: 'Token has already been invalidated.'
			})
		};

		// add token to the blacklist 
		blacklist.push(token);

		res.status(StatusCodes.OK).json({
			success: true,
			message: 'User logged out successfully.'
		})
		
	} catch ( error) {
		console.log('Error logging out user: ', error );

		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: 'Failed to logout user',
		})
	};
}

const deleteUser = async (req, res) => {
	try {
		// validate user ID
		const userId = req.user.id;

		if (!userId) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: 'User ID is required.'
			})
		}
		
		// soft delete (mark as inactive)
		const user = await User.findByIdAndUpdate(userId, { active: false});

		// check if user exists
		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				success: false,
				message: 'User not found.'
			})
		}

		// send success response
		res.status(StatusCodes.OK).json({
			success: true,
			message: 'User account deleted.',
			data: null
		})
	} 
	catch( error) {
		console.log('Error deleting user: ', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: 'Failed to delete user.'
		})		
	}
}

module.exports = {
	register, 
	login,
	getUserProfile,
	getAllUsers,
	logoutUser,
	deleteUser
}