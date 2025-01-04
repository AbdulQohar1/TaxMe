const mongoose = require('mongoose');

const taxDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    file_size: {
      type: String,
      default: "0MB",
    },
    
    timestamps: true,
  }
)

module.exports = mongoose.model('taxDocument' , taxDocumentSchema)