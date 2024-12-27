const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');
const { passwordResetMailSender} = require('../utilis/mailSender');
const { StatusCodes } = require('http-status-codes');

const forgotPassword = async (req , res) => {
  try {
    const user = await User.findOne({ email: req.body.email})

    // check if user exist in the db
    if (!user) {
     return  res.status(StatusCodes.NOT_FOUND).json({
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
        token: resetToken, 
      });

      console.log('Searching with token:', token);

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
}

const resetPassword = async (req, res) => {
  try {
    // provide new password and token sent to user email
    const { token, newPassword, confirmPassword } = req.body;

    // console.log('Received token:', token);
    
    // // Find the user and log the full query
    // const query = {
    //   passwordResetToken: token,
    //   passwordResetTokenExpires: { $gt: Date.now() }
    // };
    // console.log('Query:', query);
    
    // const user = await User.findOne(query);
    // console.log('Found user:', user);

    // validate provided credentials
    if (!token || !newPassword || !confirmPassword) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message:
          "Couldn't process request. Please provide all required fields",
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    console.log('Hashed token for query:', hashedToken);

    const user = await User.findOne({
      passwordResetToken: hashedToken, 
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    // Check if user exists
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired reset token',
      })
    } 

    // confirming password match 
    if (newPassword !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Passwords didn't match",
      });
    }

    // hash user's new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token and expiry fields
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    // save the updated user
    await user.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });
    
  } catch (error) {
    console.error("reset-password-error", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to reset password. Please try again later.'
    });
  }
}


// const resetPassword = async ( req, res) => {
//   try {
//     // get token from url params
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     // find the user by the reset token and check if it's still valid
//     const user = await User.findOne({
//       passwordResetToken: token,
//       passwordResetTokenExpires: { $gt: Date.now() }
//     });

//     // if token is invalid or expired
//     if (!user) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: 'Invalid or expired reset token',
//       });
//     }

//     // hash the new password
//     const salt = await bcrypt.getSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     // save the updated user
//     await user.save();

//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: 'Password reset successfully. You can now log in.',
//     });
  
//   } catch ( error) {
//     console.log('Error resetting user password:' , error.message);

//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: 'Failed to reset password. Please try again later.'
//     })
//   }
// }  
        
module.exports = {
  forgotPassword,
  resetPassword,
}


