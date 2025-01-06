const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/multer');
const {uploadDocument} = require('../controllers/uploadTaxDocument')

router.post('/upload-tax-document', uploadMiddleware.single('file'), uploadDocument );


module.exports = router;