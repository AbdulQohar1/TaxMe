const { User } = require('../models/user');
const OTP = require('../models/otp');
const { StatusCodes } = require('http-status-codes');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// send reset password email

async function sendResetPasswordMail(email, otp) {
	try {
		const mailResponse = await mailSender(
			email,
			`<h2>Here's passord reset OTP</h2>
			<p>Here's your OTP code: ${otp}</p>`
		);
		console.log("Verification email sent successfully: ", mailResponse);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
};


const forgotPassword = async (res , req) => {
  try {
    const { email } = req.body;
    
    // check if user email exists in the db
    const user = await User.findOne({ email });
    
    if (!user) {      
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false, 
        message: 'User with the provided email not found'
      })
      }
      
      // generate OTP and save it to the database
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      // save OTP in db 
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(otp, salt);
    
      await OTP.create({
        userId: user._id,
        email: user.email,
        otp: hashedOtp,
        createdAt: Date.now(),
      });

      // send OTP via email
      await sendResetPasswordMail(user.email , otp);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'OTP sent to your email for password reset.',
      })

    } catch (error) {
      console.log(error.message);
		  return res.status(500).json({
			success: false,
			error: error.message
		})
    }
   
    // send resetToken to user's email 
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
  
      // setting up email content and recipient
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: http://localhost:3000/reset-password/${OTP}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(StatusCodes.FORBIDDEN).json({
            success: false,
            message: 'Error sending reset password email'
          })
        } else {
          res.status(StatusCodes.OK).json({
            success: success,
            message: 'Check your email for instructions on resetting your password...'
          })
        }
      });   
    } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
			message: 'Email not found...'
    })
  }

};

const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, confirmPassword } = req.body;

    if (!otp || !newPassword || !confirmPassword) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: true,
        message:
          "Couldn't process request. Please provide all mandatory fields",
      });
    }

    const user = await User.findOne({
      resetPasswordOTP: req.body.otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.send({
        error: true,
        message: "Password reset token is invalid or has expired.",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "Passwords didn't match",
      });
    }

    console.log(newPassword);
    
  } catch (error) {
    console.error("reset-password-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}

module.exports = {
  resetPassword,
  forgotPassword 
}