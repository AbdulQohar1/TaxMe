const otpGenerator = require('otp-generator');
const OTP = require('../models/otp');
const User = require('../models/user');

exports.sendOTP = async (req, res) => {
	try {
		const { email } = req.body;

		// confirm if user is already existing
		const checkUserExist  = await User.findOne({ email });
		// if user with the provided email already exist
		if (checkUserExist) {
			return res.status(401).json({
				success: false,
				message: 'User is already registered!',
			});
		}

		let otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

		let result = await OTP.findOne({ otp: otp });
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
			
			result = await OTP.findOne({ otp: otp});
		}

		const otpPayload = { email, otp};
		let otpBody = await OTP.create( otpPayload);

	
		res.status(200).json({
			success: true,
			message: 'OTP sent successfully!', 
			otpBody
		})

	} catch (error) {
		console.log(error.message);
		return res.status(500).json({
			success: false,
			error: error.message
		})
		
	}
};