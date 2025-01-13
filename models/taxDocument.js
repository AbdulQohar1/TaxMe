const mongoose = require('mongoose');

const taxDocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    document_size: {
      type: Number,
      required: true,
      default: "0MB",
    },
    document_type: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'txt'],
      required: true,
    },
    documentUrl: {  
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    
  },
  {
    timestamps: true
  }
);

// indexes for better query performance
taxDocumentSchema.index({ userId: 1});
taxDocumentSchema.index({ createdAt: -1})

module.exports = mongoose.model('taxDocument' , taxDocumentSchema);