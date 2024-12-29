const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');

const selectCategory = async (req , res) => {
  try {
    const { email, category } = req.body;

    // validate category 
    if (!['basic', 'gold', 'premium'].includes(category)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid category selected.'
      });
    }

    // update user's category
    const user = await User.findByIdAndUpdate(
      { email },
      { category },
      { new: true }
    );

    // verify user 
    if (!user) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Category updated successfully.',
      data: user
    })

  }
  catch (error) {
    console.error('Error setting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set user category...',
    });
  }
}

// const upgradeCategory = async (req, res) => {
//   try {
//     // Log headers and body for debugging
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);

//     // Extract email from headers and category from body
//     const userEmail = req.headers.useremail;
//     const { category } = req.body;

//     // Validate email
//     if (!userEmail || typeof userEmail !== 'string') {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid user email is required in headers.',
//       });
//     }

//     // Validate category
//     if (!category || !['basic', 'gold', 'premium'].includes(category)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid category selected. Must be one of: basic, gold, premium',
//       });
//     }

//     // Sanitize email
//     const sanitizedEmail = userEmail.toLowerCase().trim();

//     // Find user by email
//     const user = await User.findOne({ email: sanitizedEmail });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }

//     // Check if the user is already in the requested category
//     if (user.category === category) {
//       return res.status(400).json({
//         success: false,
//         message: `You're already in the ${category} category.`,
//       });
//     }

//     // Update user category
//     user.category = category;
//     user.categoryUpdatedAt = new Date();
//     await user.save();

//     // Return success response
//     return res.status(200).json({
//       success: true,
//       message: 'Category upgraded successfully.',
//       data: {
//         email: user.email,
//         category: user.category,
//       },
//     });
//   } 
//   catch (error) {
//     console.error('Error upgrading category:', {
//       name: error.name,
//       message: error.message,
//       stack: error.stack,
//     });
    
//     return res.status(500).json({
//       success: false,
//       message: "Failed to set user category. Please try again later.",
//     });
//   }
// };

const upgradeCategory = async (req, res) => { 
  try {
    // Log headers and body for debugging
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    // Extract email from headers and category from body
    const userEmail  = req.headers.useremail; 
    const { category } = req.body;

      // Validate email
      if (!userEmail || typeof userEmail !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Valid user email is required in headers.',
        });
      }

    // // Check if email header is missing
    // if (!useremail) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'User email is required in headers.',
    //   });
    // }

    // Validate category
    if (!category || !['basic', 'gold', 'premium'].includes(category)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid category selected',
      });
    }


    // Find user by email
    const user = await User.findOne({ email: useremail.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if the user is already in the requested category
    if (user.category === category) {
      return res.status(400).json({
        success: false,
        message: `You're already in the ${category} category.`,
      });
    }

    // Update user category
    user.category = category;
    await user.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Category upgraded successfully.',
      data: {
        email: user.email,
        category: user.category,
      },
    });
  } 
  catch (error) {
    console.error('Error upgrading category:', error);
    res.status(500).json({
      success: false,
      message: "Failed to set user category. Please try again later.",
    });
  }
};



// const upgradeCategory =  async (req , res) => {
//   try {
//     // Log incoming request hader & body
//     console.log('Headers:', req.headers);
//     console.log('Request Body:', req.body);
  
//     // email from headers
//     const { useremail } = req.headers; 
//     // new category from body
//     const { category } = req.body;

//     // verify if header is provided 
//     if (!useremail) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: 'User email is required in headers.',
//       });
//     }
    
//     // validate category
//     if (!['basic', 'gold', 'premium'].includes(category)) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: 'Invalid category selected',
//       });
//     }

//     // find user 
//     const user = await User.findOne({ email: useremail.toLowerCase() });

//     if (!user) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: 'User not found'
//       })
//     }

//     // check if user is already in the selected category
//     if (user.category === category) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: `You're already in the ${category} category`,
//       });
//     }

//     // Log current category before update
//     console.log('Current Category:', user.category);

//     // update user's category
//     user.category = category;
//     await user.save();

//     console.log('Category Updated To:', user.category);

//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: 'Category upgraded successfully.',
//       data: user,
//     });
//   }
//   catch (error ){
//     console.error('Error upgrading category:', error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Can't upgrade category. Please try again later. ",
//     });
//   }
// }
// const updateCategory =  async (req, res) => {
//   try {
//     // extract header and body
//     const { username , usertoken} = req.headers;
//     const { category } = req.body;

//     // validate user input 
//     if (!username || !usertoken || !category) {

//       return  res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: 'Please provided all required fields...'
//       });
//     }
    
//     // find user by email aand verify token 7
//     const user = await User.findOne({
//       email: useremail,
//       // Assuming resetPasswordToken can act as auth token
//       resetPasswordToken: usertoken, 
//       // Ensure token is valid
//       resetPasswordTokenExpires: { $gt: Date.now() }, 
//     });

//     if (!user) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         success: false,
//         message: 'Invalid or expired token'
//       })
//     }

//     // update user's category 
//     user.category = category;

//     // save updated user
//     await user.save();

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: 'Category updated successfully...'
//     })
//   } catch (error) {
//     console.error('update-category-error:', error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: 'Failed to update category. Please try again later.',
//     });
//   }
// }

module.exports = {
  selectCategory,
  upgradeCategory
};