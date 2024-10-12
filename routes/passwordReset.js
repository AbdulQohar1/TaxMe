const express = require('express');
const forgetPasswordController = require('../controllers/forgetPasswordController');

const router = express.Router();
router.post ('/forgot-password', forgetPasswordController.resetPassword);
router.post('/reset-password', forgetPasswordController.resetPassword)
module.exports = router;
