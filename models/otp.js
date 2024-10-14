const mongoose = require('mongoose');
const { mailSender } = require('../utilis/mailSender');
const bcrypt = require('bcryptjs');

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
		// OTP expires in 5 minutes
		expires: 60 * 5, 
	}
});

// Encrypting user's OTP and sending email
OtpSchema.pre('save', async function (next) {
	// Send an email only when a new OTP is created
	if (this.isNew) {
		console.log("Sending OTP: ", this.otp);
		await sendVerificationMail(this.email, this.otp); // Send the OTP before hashing
	}

	// Encrypt OTP
	const salt = await bcrypt.genSalt(15);
	this.otp = await bcrypt.hash(this.otp, salt);

	next(); // Proceed with saving the document
});

// Function that sends email
async function sendVerificationMail(email, otp, body) {
	try {
		const mailResponse = await mailSender(
			email,
			`<h2>Please confirm your OTP</h2>
			<p>Here's your OTP code: ${otp}</p>`
		);
		console.log("Verification email sent successfully: ", mailResponse);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
};


// // Compare user's OTP with the provided OTP
// OtpSchema.methods.compareOTP = async function (providedOtp) {
// 	const otpMatch = await bcrypt.compare(providedOtp, this.otp);
// 	return otpMatch;
// };

// Create the Otp model
const OtpModel = mongoose.model('otp', OtpSchema);

module.exports = OtpModel;
