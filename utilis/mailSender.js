const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
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
			from: 'adebayoabdulqohar1@gmail.com',
			to: email,
			subject: title,
			html: body,
		});

		console.log("Email info:", info);
		return info;
	} catch (error) {
		console.log(error.message);	
	}
}

module.exports = mailSender;