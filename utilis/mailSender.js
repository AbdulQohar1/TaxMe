const nodemailer = require('nodemailer');

const mailSender = async (email, body ) => {
	try {
		// create a transporter that sends email
		let transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			}
		});

		// sending email to user 
		let info = await transporter.sendMail({
			from: process.env.MAIL_USER,
			to: email,
			subject: "Verify your Email",
			html: body,
		});

		console.log("Email info:", info);
		return info;
	} catch (error) {
		throw new Error(error.message);
	}
}

const passwordResetMailSender = async (email, body ) => {
	try {
		// create a transporter that sends email
		let transporter = nodemailer.createTransport({
			// host: process.env.MAIL_HOST,
			service: process.env.MAIL_SERVICE || 'gmail',
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			}
		});

		// sending email to user 
		let info = await transporter.sendMail({
			from: process.env.MAIL_USER || `TaxMe support <taxmesupport@gmail.com>`,
			to: email,
			subject: "Reset your password",
			html: body,
		});

		console.log("Email sent successfully:", info);
		return info;
	} catch (error) {
		console.error("Error sending password reset email:", error.message);
		throw new Error(error.message);
	}
}

module.exports = { 
	mailSender, 
	passwordResetMailSender, 
};