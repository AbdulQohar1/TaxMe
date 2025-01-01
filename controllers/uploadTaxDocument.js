
const { StatusCodes } = require('http-status-codes');
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const uploadTaxDocument = require('../middleware/multer');
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
      folder: 'documents'
    });

    // const result = await cloudinary.uploader.upload(req.file.path, {
    //   resource_type: 'raw',
    //   // cloudinary folder name  
    //   folder: 'documents' 
    //   // specify resource type for documents
    // });

    // respond with success and  file details
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Tax document uploaded successfully!',
      data: result
    });
  } catch (error) {
    console.log('Error uploading document: ', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Upload tax document failed.',
      error: error.message
    })
    
  }
}

module.exports = {uploadDocument};
// const uploadDocument = uploadTaxDocument.single('document'), 
// function(req , res) {
//   cloudinary.uploader.upload(req, file.name, function(err, result) {
//     if (err) {
//       console.log(err);
//       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: 'Upload tax document failed...'
//       })
//     };

//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: 'Document uploaded successfully!',
//       data: result
//     })
//   })
// }

// const uploadDocument = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     // Cloudinary folder name
//     folder: 'documents', 
//     // Force files to be saved as PDFs
//     format: async (req, file) => 'pdf', 
//     // Unique file name
//     public_id: (req, file) => `${Date.now()}-${file.originalname}`,
//     // For non-image files like PDFs, DOCX, etc. 
//     resource_type: 'raw', 
//   },
// });



