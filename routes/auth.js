const express = require('express');
const { 
  setCategory,
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
router.post('/set-category', setCategory);
router.patch('/update-category', upgradeCategory)

// router.post('/updateCategory',  updateCategory)

module.exports = router;
