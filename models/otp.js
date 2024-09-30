const mongoose = require('mongoose');
const mailSender = require('../utilis/mailSender');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// creating otp schema
const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5
    }
})

// encrypting user's otp

// function that sends email
async function sendVerificationMail (email, otp) {
	try {
		const mailResponse = await mailSender(email,
				'Verification Email',
				`<h1>Please confirm your OTP</h1>
				<p>Here's your OTP code: ${otp}</p>`
		);
		console.log("Verifiction email sent successfully: ", mailResponse);
		
} catch (error) {
		console.log("Error occured while sending email: ", error);

		throw error;        
	}
}

OtpSchema.pre('save', async function encryptedOTP(next) {
	// send an email only when a new user is created
	if (this.isNew) {
		await  sendVerificationMail( this.email, this.otp);
	};

	const salt = await bcrypt.genSalt(15);
	this.otp = await bcrypt.hash(this.otp, salt)
	console.log("New docs saved to the database");

	next();
})

// compare user's otp and the provided otp
OtpSchema.methods.compareOTP = async function (providedOtp) {
	
	const otpMatch = await bcrypt.compare(providedOtp , this.otp);

	return otpMatch;
}

module.exports = mongoose.model('OTP' , OtpSchema);