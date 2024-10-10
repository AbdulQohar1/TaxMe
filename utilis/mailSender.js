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

		// console.log(error.message);	
	}
}

module.exports = mailSender;