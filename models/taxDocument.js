const mongoose = require('mongoose');

const taxDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    document_size: {
      type: String,
      default: "0MB",
    },
    document_type: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'txt']
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('taxDocument' , taxDocumentSchema);