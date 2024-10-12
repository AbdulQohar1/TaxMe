const { User } = require('../models/user');
const OTP = require('../models/otp');
const mailSender = require('../utils/mailSender');
const otpController = require('../controllers/otpController');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

router.post ("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    // check if user email exists in the db
    const checkUserEmail = await User.findOne({ email });
    
    if (checkUserEmail) {
      // generate a reset token 
      let token = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }
    
  } catch (error) {
    
  } 
})

// router.post("/forget-password", async (req , res) => {
//   const { email} = req.body;

//   // check if user email exists in the db
//   const 
//   // if (User.email) {
//   //   // generate a reset token
//   //   // const token = otpGenerator.generate()
//   //   let token = otpGenerator.generate(6, {
// 	// 		upperCaseAlphabets: false,
// 	// 		lowerCaseAlphabets: false,
// 	// 		specialChars: false,
// 	// 	});
//   // }
// })
