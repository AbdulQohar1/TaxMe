const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');
const { passwordResetMailSender} = require('../utilis/mailSender');
const { StatusCodes } = require('http-status-codes');
const { subscribe } = require('diagnostics_channel');

const sendResetPasswordMail = async (email) => {
	try {
		const mailResponse = await passwordResetMailSender(
			email,
			`<h2>Click the link below to reset your password</h2>
      
			<p> Click the following link to reset your password: http://localhost:3000/reset-password/token</p>`
		);
		console.log("Verification email sent successfully: ", mailResponse);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
};


const forgotPassword = async (req , res) => {
  try {
    const user = await User.findOne({ email: req.body.email})

    // check if user exist in the db
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Couldn't find the user with the provided email"
      });
    }

    try {
      // Generate the reset token using the instance method defined in the user schema
    const resetToken = await user.createResetPasswordToken();

    // Save the user with the new token and expiry date
    await user.save({ validateBeforeSave: false });
    
    // send reset password mail
    await passwordResetMailSender(user.email, resetToken);
    // await sendResetPasswordMail(user.email, resetToken)

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Reset password email sent successfully',
    });

    } catch (tokenError) {
      // If there's an error generating token or sending email, clean up
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error sending reset email. Please try again.',
      });
    }

    
    }  
    catch (error) {
      console.error("Error during password reset request:", error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Couldn't process request. Please try again later.",
        error: error.message,
      });
    }
  

};

const resetPassword = async ( req, res) => {
  try {
    // get token from url params
    const { token } = req.params;
    const { newPassword } = req.body;

    // find the user by the reset token and check if it's still valid
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() }
    });

    // if token is invalid or expired
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // hash the new password
    const salt = await bcrypt.getSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // save the updated user
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });
  
  } catch ( error) {
    console.log('Error resetting user password:' , error.message);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to reset password. Please try again later.'
    })
    
  }
}

module.exports = {
  forgotPassword,
  resetPassword,
}

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

