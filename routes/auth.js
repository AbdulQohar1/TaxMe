const express = require('express');
const { 
  selectCategory,
  upgradeCategory,
  getUserCategoryList
} = require('../controllers/category');
const  { 
  register, 
  login, 
  getUserProfile, 
  getAllUsers,
  logoutUser,
  deleteUser
} = require('../controllers/auth');
const { updateProfilePicture} = require('../controllers/userController')
const authMiddleware = require('../middleware/authentication');
const uploadMiddleware = require('../middleware/multer')

const router = express.Router();

router.get('/' , getAllUsers);
router.post('/register' , register);
router.post('/login' , login);
router.get('/getUserProfile' , getUserProfile);
router.put('/update-profile-picture', authMiddleware, uploadMiddleware.single('file'), updateProfilePicture);
router.post('/select-category', selectCategory);
router.patch('/upgrade-category', upgradeCategory);
router.get('/get-user-category-list', getUserCategoryList)
router.delete('/delete-user', authMiddleware, deleteUser);
router.post('/logout' , logoutUser);

module.exports = router;
