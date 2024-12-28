const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { required } = require('joi');

// create User schema
const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Please provide your name'],
    minLength: 3,
    maxLength: 60,
  },
  email: {
  type: String,
  required: [true, 'Please provide your name'],  
  match: [
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    'Please provide a valid email',
  ],
  unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minLength: 8,
    maxLength: 1024,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password...'],
    validate: {
      validator: function (val) {
        return val === this.password
      }, 
      message: 'Password and Confirm password does not match'
    },
    select: false
  },
  contact: {
    type: Number,
    require: [true, 'Please provide your phonenumber']
  },
  status: {
    type: String, 
    default: 'active'
  },
  role: {
    type: String, 
    default: 'user'
  },
  category: {
    type: String,
    enum: ['basic' , 'gold'  , 'premium'],
    default: 'basic',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date
}, 

{
  timestamps: true,
});

// encrypting users details
UserSchema.pre('save' , async function encryptedPassword (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
})

// creating user token
UserSchema.methods.createToken = function () {
  return jwt.sign({ 
    userId: this._id,
    fullname: this.fullname}, 
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME
    }
  );
}

// comparing user's password and inputed password
UserSchema.methods.comparePassword = async function (inputedPassword) {
  const passwordMatch = await bcrypt.compare (inputedPassword , this.password);
  return passwordMatch;
}

// create an instance functon for resetPassword
UserSchema.methods.createResetPasswordToken = async function (){
  // generate token 
  const resetToken = crypto.randomBytes(20).toString('hex');
  console.log("resetToken: ", resetToken);
  

  // encrpt token before saving to db
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); 

  //resetToken expires in 5 mins  
  this.passwordResetTokenExpires = Date.now() + 5  * 60 * 1000;  

  console.log(resetToken , this.passwordResetToken);
  
  return resetToken;
  
}

module.exports = mongoose.model('User' , UserSchema);