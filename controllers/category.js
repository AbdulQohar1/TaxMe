const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');

// available categories
const availableCategories = [
  {
    name: "Individual",
    category_id: "1",
    id: "65e8"
  },
  {
    name: "Partnership",
    category_id: "2",
    id: "b66d"
  },
  {
    name: "Corporation",
    category_id: "3",
    id: "e7b5"
  },
  {
    name: "Sole Proprietorship",
    category_id: "4",
    id: "3ebb"
  },
  {
    name: "Others",
    category_id: "5",
    id: "21d3"
  }
];

const selectCategory = async ( req, res) => {
  try { 
    const { email, category} = req.body;
    
    // Case-insensitive category validation
    const selectedCategory = availableCategories.find(
      cat => cat.name.toLowerCase() === category.toLowerCase()
    );

    if(!selectedCategory) {
      const categoryNames = availableCategories.map(cat => ({ name: cat.name }));

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'invalid category selected',
        category: categoryNames //this returns available category names for easy reference
      });
    }

    // find user and update user's category
    const user = await User.findOneAndUpdate(
      { email },
      {
        category: selectedCategory.name,
        category_id: selectedCategory.category_id,
        category_reference_id: selectedCategory.id
      },
      {
        new: true,
      }
    );

    // verify user exists
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Category updated successfully.',
      data: {
        user,
        selected_category: selectedCategory.name
      }
    });
  } catch (error) {
    console.error('Error setting category:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to set user category.',
      error: error.message
    });
  }
}

const upgradeCategory =  async (req , res) => {
  try {  
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
    const user = await User.findOne({ email: useremail });

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

const getUserCategoryList = async (req , res) => {
  try {
    // fetch users and select only name and id;
    const users = await User.find({}, '_id fullname category');

    // prepare the category list 
    const categoryList = users.map(user => ({
      id: user._id,
      name: user.fullname,
      category: user.category
    }));
    
    // send response
    return res.status(StatusCodes.OK).json({
      success: true,
      category_list: categoryList
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch user-category list.',
      error: error.message,
    })
  }
}





module.exports = {
  selectCategory,
  upgradeCategory,
  getUserCategoryList
};