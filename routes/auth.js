const express = require('express');
const { 
  selectCategory,
  upgradeCategory
} = require('../controllers/category');
const  { 
  register, login, 
  getUserProfile, getAllUsers
} = require('../controllers/auth');

const router = express.Router();

router.get('/' , getAllUsers);
router.post('/register' , register);
router.post('/login' , login)
router.get('/getUserProfile' , getUserProfile);
router.post('/select-category', selectCategory);
router.patch('/upgrade-category', upgradeCategory)

module.exports = router;
