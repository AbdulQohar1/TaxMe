const { StatusCodes } = require('http-status-codes');
const cloudinary = require('../utilis/cloudinaryConfig');

// Set up Cloudinary storage
const uploadDocument = async (req , res) => {
  try {
    // check if file is provided by the user
    if(!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Upload your tax document, please.'
      })
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
      folder: 'documents',
    });

    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);

    // respond with success and  file details
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Tax document uploaded successfully!',
      data:  {
        documentUrl: result.secure_url,
        documentId: result.public_id,
        originalName: req.file.originalname,
        format: result.format,
        size: result.bytes
      },
    });
  } catch (error) {
    console.log('Error uploading document: ', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Document upload failed.',
      error: error.message | 'Missing file or invalid file field name. Make sure to upload using "file" as the key.'
    })
    
  }
} 

module.exports = {uploadDocument};
