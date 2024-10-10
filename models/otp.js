const mongoose = require('mongoose');
const mailSender = require('../utilis/mailSender');
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
async function sendVerificationMail(email, otp) {
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


// Compare user's OTP with the provided OTP
OtpSchema.methods.compareOTP = async function (providedOtp) {
	const otpMatch = await bcrypt.compare(providedOtp, this.otp);
	return otpMatch;
};

// Create the Otp model
const OtpModel = mongoose.model('otp', OtpSchema);

module.exports = OtpModel;





// // create the Otp model
// const OtpModel = mongoose.model('Otp', OtpSchema);

// // encrypting user's otp
// // function that sends email
// async function sendVerificationMail (email, otp) {
// 	try {
// 		const mailResponse = await mailSender(email,
// 				'Verification Email',
// 				`<h1>Please confirm your OTP</h1>
// 				<p>Here's your OTP code: ${otp}</p>`
// 		);
// 		console.log("Verifiction email sent successfully: ", mailResponse);
		
// } catch (error) {
// 		console.log("Error occured while sending email: ", error);

// 		throw error;        
// 	}
// }

// OtpSchema.pre('save', async function encryptedOTP(next) {
// 	// send an email only when a new user is created
// 	if (this.isNew) {
// 		console.log("Sending OTP: ", this.otp);
// 		await  sendVerificationMail( this.email, this.otp);
// 	};

// 	const salt = await bcrypt.genSalt(15);
// 	let hashedOTP = await bcrypt.hash(this.otp , salt);

// 	const newUserOTP = await new OtpModel({
// 		email: this.email,
// 		otp: hashedOTP, // Hashed OTP from earlier
// 		createdAt: Date.now()
// 	});
// 		// save otp record
// 		await newUserOTP.save();
// 		console.log("New docs saved to the database", newUserOTP);

// 	next();
// });

// await sendVerificationMail(this.email, this.otp);

// // compare user's otp and the provided otp
// OtpSchema.methods.compareOTP = async function (providedOtp) {
	
// 	const otpMatch = await bcrypt.compare(providedOtp , this.otp);

// 	return otpMatch;
// }

// module.exports = mongoose.model('OTP' , OtpSchema);