const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utilis/cloudinaryConfig');

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // folder in Cloudinary
    folder: 'documents', 
    // for non-image files like PDFs and DOCX
    resource_type: 'raw', 
    // retain original file format
    format: async (req, file) => file.originalname.split('.').pop(),
    // Unique file name (original file name + current timestamp)
    public_id: (req, file) => `${file.originalname}-${Date.now()}`, 
  },
});

// File filter (optional) for validating file types
const fileFilter = (req, file, cb) => {
  // Allowed file formats
  const allowedTypes = /pdf|doc|docx|txt/; 

  const isValid = allowedTypes.test(file.mimetype);

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed.'));
  }
};

const uploadTaxDocument = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, //10MB limit
  fileFilter
})

module.exports = uploadTaxDocument

