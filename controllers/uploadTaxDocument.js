const express = require('express');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utilis/cloudinaryConfig');

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // Cloudinary folder name
    folder: 'documents', 
    // Force files to be saved as PDFs
    format: async (req, file) => 'pdf', 
    // Unique file name
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    // For non-image files like PDFs, DOCX, etc. 
    resource_type: 'raw', 
  },
});

// file filter (optional) for validating file types
const fileFilter = (req, file, cb) => {
  // allowed file formats
  const allowedTypes = /pdf|doc|docx|txt/; 
  const isValid = allowedTypes.test(file.mimetype);
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed.'));
  }
};

// multer middleware
const uploadTaxDocument = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

module.exports = uploadTaxDocument