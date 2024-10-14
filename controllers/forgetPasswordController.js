const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { passwordResetMailSender} = require('../utilis/mailSender');
const { StatusCodes } = require('http-status-codes');
dotenv.config();

const forgotPassword = async (req, res  ) => {
  try {
    const user = await User.findOne({ email: req.body.email})

    // check if user exist in the db
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Couldn't find the user with the provided email"
      });
    }

    // Generate the reset token using the instance method defined in the user schema
    const resetToken = await user.createResetPasswordToken();
  
    // Save the user with the new token and expiry date
    await user.save();
 
    // send reset password mail
    await passwordResetMailSender(user.email, resetToken);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Reset password email sent successfully',
    });
  } catch (error) {
    console.log(error.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'An error occurred while processing your res-password request',
    });
  }
}

const resetPassword = async (req, res, next) => {
  try {
  const { resetToken } = req.params;

  const { Password, confirmPassword } = req.body;
 
  
  } catch (error) {
    
  }
}



/*
const { User } = require('../models/user');
const OTP = require('../models/otp');
const { StatusCodes } = require('http-status-codes');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// send reset password email

const sendResetPasswordMail = async (email, otp) => {
	try {
		const mailResponse = await mailSender(
			email,
			`<h2>Here's password reset OTP</h2>
			<p>Here's your OTP code: ${otp}</p>`
		);
		console.log("Verification email sent successfully: ", mailResponse);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
};


const forgotPassword = async (req , res) => {
  try {
    const { email } = req.body;

    // Check if the email was provided
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email is required",
      });
    }
    
    // check if user email exists in the db
    const user = await User.findOne({ email });
    
    if (!user) {      
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false, 
        message: 'User with the provided email not found'
      })
    }
      
    // // Generate a reset token
    // const token = crypto.randomBytes(20).toString('hex');
    // // Store the token with the user's email in a database or in-memory store
    // user.resetToken = token
    // console.log(token);
    
    // generate OTP and save it to the database
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // hash OTP before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
  
      // save OTP in db
    await OTP.create({
      userId: user._id,
      email: user.email,
      otp: hashedOtp,
      createdAt: Date.now(),
    });

    // send OTP via email
    await sendResetPasswordMail(user.email , otp);

    // response indicating that OTP was sent
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'OTP sent to your email for password reset.',
    })
    

    } catch (error) {
      console.error("Error during password reset request:", error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Couldn't process request. Please try again later.",
        error: error.message,
      });
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
*/
// const resetPassword = async (req, res) => {
//   try {
//     const { otp, newPassword, confirmPassword } = req.body;

//     if (!otp || !newPassword || !confirmPassword) {
//       return res.status(StatusCodes.FORBIDDEN).json({
//         success: false,
//         message:
//           "Couldn't process request. Please provide all mandatory fields",
//       });
//     }

//     const user = await User.findOne({
//       resetPasswordOTP: req.body.otp,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     // if (!user) {
//     //   return res.send({
//     //     error: true,
//     //     message: "Password reset token is invalid or has expired.",
//     //   });
//     // }
//     if (user) {
//       res.send({
//         error: true,
//         message: "Password reset token is invalid or has expired.",
//       })
//     } else {

//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         error: true,
//         message: "Passwords didn't match",
//       });
//     }

//     console.log(newPassword);
    
//   } catch (error) {
//     console.error("reset-password-error", error);
//     return res.status(500).json({
//       error: true,
//       message: error.message,
//     });
//   }
// }

module.exports = {
  forgotPassword,
  // resetPassword,
}