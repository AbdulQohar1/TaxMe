const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const bcrypt = require('bcryptjs');

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

module.exports = {
	register, 
	login
}