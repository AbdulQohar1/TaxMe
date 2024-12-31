const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb: null, file.originalname
  }
});

const uploadTaxDocument = multer({storage: storage})

module.exports = uploadTaxDocument

// const uploadTaxDocument = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: fileFilter,
// });