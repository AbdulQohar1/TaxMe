const express = require('express');
const router = express.Router();
const uploadTaxDocument = require('../middleware/multer');
const {uploadDocument} = require('../controllers/uploadTaxDocument')

router.post('/uploadTaxDocument', uploadTaxDocument.single('document'),uploadDocument );

module.exports = router;