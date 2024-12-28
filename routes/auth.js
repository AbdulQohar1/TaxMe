const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const { StatusCodes } = require('http-status-codes');
// const { BadRequestError, UnauthenticatedError } = require('../errors');
const {updateCategory} = require('../controllers/category');
const  { 
  register, login, 
  getUserProfile, getAllUsers
} = require('../controllers/auth');

const router = express.Router();

router.get('/' , getAllUsers);
router.post('/register' , register);
router.post('/login' , login)
router.get('/getUserProfile' , getUserProfile);
// router.post('/updateCategory',  updateCategory)

module.exports = router;
