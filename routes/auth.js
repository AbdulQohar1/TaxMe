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
const authMiddleware = require('../middleware/authentication');

const router = express.Router();

router.get('/' , getAllUsers);
router.post('/register' , register);
router.post('/login' , login);
router.get('/getUserProfile' , getUserProfile);
router.post('/select-category', selectCategory);
router.patch('/upgrade-category', upgradeCategory);
router.put('/get-user-category-list', getUserCategoryList)
router.delete('/delete-user', authMiddleware, deleteUser);
router.post('/logout' , logoutUser)

module.exports = router;
