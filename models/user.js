const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  }
}, 
{
  timestamps: true,
} 
);

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

module.exports = mongoose.model('User' , UserSchema);