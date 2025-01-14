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
    const { email , category } = req.body;
    
    // validate category exist in availableCategories option
    const selectedCategory = availableCategories.find(
      cat => cat.name === category
    );

    if ( !selectedCategory ) {
      const categoryNames = availableCategories.map(
        cat => ({ name: cat.name })
      )

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid category selected',
        category: categoryNames, // Returns available categories for reference
      });
    }

    // find user 
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    // check if user is already in the selected category
    if (user.category === selectedCategory.name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `You're already in the ${selectedCategory.name} category`,
      });
    }

    // update user's category and it's related fields
    user.category = selectedCategory.name,
    user.category_id = selectedCategory.category_id,
    user.category_reference_id = selectedCategory.id
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Category upgraded successfully.',
      data: {
        user,
        selected_category: selectedCategory.name,
      },
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
    // fetch users with their category information
    const users = await User.find({}, '_id fullname category category_id ');

    // map users to include their category informations
    const categoryList = users.map( user => {
      // find the matching category from availableCategories
      const userCategory = availableCategories.find(
        cat => cat.name === user.category
      );

      return {
        id: user._id,
        name: user.fullname,
        category: userCategory ? userCategory.name: 'Uncategorized',
        category_id: userCategory ? userCategory.category_id : null
      }
    })

    // prepare the category list 
    // const categoryList = users.map(user => ({
    //   id: user._id,
    //   name: user.fullname,
    //   category: selectedCategory.name,
    //   // category: user.category
    // }));
    
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