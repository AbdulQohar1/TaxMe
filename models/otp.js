const mongoose = require('mongoose');
const mailSender = require('../utilis/mailSender');

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

OtpSchema.pre('save', async function (next) {
	console.log("New docs saved to the database");
	// Only send an email when a new user is created
	if (this.isNew) {
		await  sendVerificationMail( this.email, this.otp);
	};
	next();
})

module.exports = mongoose.model('OTP' , OtpSchema);