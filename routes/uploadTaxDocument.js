const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/multer');
const authMiddleware = require('../middleware/authentication');
// const authMiddleware = re
const {
  uploadDocument,
  getDocument
} = require('../controllers/uploadTaxDocument');

router.post('/upload-tax-document', uploadMiddleware.single('file'), uploadDocument );
router.get('/get-document', authMiddleware, getDocument)


module.exports = router;
