const express = require('express');
const router = express.Router();

const { login, register, getUserProfile} = require('../controllers/auth');

router.post('/register' , register);
router.post('/login' , login);
router.post('/getUserProfile' , getUserProfile)

module.exports = router;