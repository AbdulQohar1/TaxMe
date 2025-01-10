const { StatusCodes } = require('http-status-codes');
const cloudinary = require('../utilis/cloudinaryConfig');
const User = require('../models/user');
const TaxDocument = require('../models/taxDocument');

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
};

const getDocument = async ( req, res) =>{
  try {
    // get user credentials as headers
    const { useremail, usertoken } = req.headers;

    // validate headers
    if (!useremail, usertoken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide valid credential in headers.'
      });
    }

    // verify token
    const decoded = jwt.verify(usertoken, process.env.JWT_SECRET);

    // check if email matches the provided token
    if (useremail !== decoded.email) {
      return  res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials; email and token mismatch.'
      });
    }

    // find user in db
    const user = await User.findOne({ email: useremail});
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found.',
      });
    }

    // fetch tax document for the user
    const taxDocument = await TaxDocument.findOne({ userId: user._id});

    if(!taxDocument) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Tax document not found.',
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      document_name: taxDocument.name,
      document_size: taxDocument.size,
      document_type: taxDocument.type,
      date_modified: taxDocument.updatedAt,

    })

    // {documents: [{id,document_name,document_size,document_type,date_modified,base64}]}


  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error getting tax document",
      error: error.message,
    })
  }
}

module.exports = {uploadDocument};
