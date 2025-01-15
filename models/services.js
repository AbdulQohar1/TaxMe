const { required } = require('joi');
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  
  },
  service_id: {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model('Service' , ServiceSchema);