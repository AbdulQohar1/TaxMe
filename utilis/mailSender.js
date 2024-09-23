const nodemailer = require('nodemailer');
const { emit } = require('../models/user');

const mailSender = async (email, title, body) => {
	try {
		// Creating transporter for sending mail
		let transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			}
		});

		// sending mail to user
		let info = await transporter.sendMail({
			from: 
		})
	} catch (error) {

	}
}