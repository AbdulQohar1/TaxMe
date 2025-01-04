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

    console.log(process.env.CLOUDINARY_CLOUD_NAME);
    console.log(process.env.CLOUDINARY_API_KEY);
    console.log(process.env.CLOUDINARY_API_SECRET);

    // upload document to cloudinary 
    const filePath = req.file.path;
    console.log('Uploaded File Path:', filePath);

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw',
      folder: 'documents',
      documentId: req.file.filename, 
      originalName: req.file.originalname,
      format: req.file.format,
      size: req.file.size,
    });

    // respond with success and  file details
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Tax document uploaded successfully!',
      data: result,
    });
  } catch (error) {
    console.log('Error uploading document: ', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Document upload failed.',
      error: error.message
    })
    
  }
}

module.exports = {uploadDocument};
