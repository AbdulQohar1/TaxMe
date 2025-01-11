const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utilis/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'documents',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'epub', 'jpg', 'jpeg', 'png'],
    public_id: (req, file) => `${file.originalname}-${Date.now()}`
  }
});

const uploadMiddleware = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/epub+zip',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, EPUB, JPEG, PNG, and JPG are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

module.exports = uploadMiddleware;

