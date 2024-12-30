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

const upgradeCategory =  async (req , res) => {
  try {
    // Log incoming request hader & body
    console.log('Headers:', req.headers);
    console.log('Request Body:', req.body);
  
    // email from headers
    const { useremail } = req.headers; 
    // new category from body
    const { category } = req.body;

    // verify if header is provided 
    if (!useremail) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User email is required in headers.',
      });
    }
    
    // validate category
    if (!['basic', 'gold', 'premium'].includes(category)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid category selected',
      });
    }

    // find user 
    const user = await User.findOne({ email: useremail.toLowerCase() });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    // check if user is already in the selected category
    if (user.category === category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `You're already in the ${category} category`,
      });
    }

    // Log current category before update
    console.log('Current Category:', user.category);

    // update user's category
    user.category = category;
    await user.save();

    console.log('Category Updated To:', user.category);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Category upgraded successfully.',
      data: user,
    });
  }
  catch (error ){
    console.error('Error upgrading category:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Can't upgrade category. Please try again later. ",
    });
  }
}

module.exports = {
  selectCategory,
  upgradeCategory
};