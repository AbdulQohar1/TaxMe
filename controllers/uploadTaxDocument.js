const jwt = require('jsonwebtoken');
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
    const {email, authorization } = req.headers;
    console.log('Received request for email:', email);

    // Check if both email and authorization header exist
    if (!email || !authorization) {
      console.log('Missing headers:', { email: !!email, authorization: !!authorization });
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide email and authorization in headers.'
      });
    };
    
    const token = authorization.split(' ')[1];
    // const { email, token } = req.headers;

    // validate headers
    if (!email || !token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide valid credential in headers.'
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded for email:', decoded.email);

    // check if email matches the provided token
    if (email !== decoded.email) {
      return  res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials; email and token mismatch.'
      });
    }

    // find user in db
    const user = await User.findOne({ email: email});
    console.log('User found:', !!user, user ? `ID: ${user._id}` : 'No user');
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found.',
      });
    }

    const allDocs = await TaxDocument.find({}).lean();
    console.log('All documents in collection:', allDocs);

    // fetch tax document for the user
    const taxDocument = await TaxDocument.findOne({ userId: user._id});
    console.log('Tax document found:', !!taxDocument, 
      taxDocument ? `ID: ${taxDocument._id}` : 'No document'
    );

    if(!taxDocument) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Tax document not found.',
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      document: [{
        id: taxDocument._id,
        title: taxDocument.title,
        document_size: taxDocument.document_size,
        document_type: taxDocument.document_type,
        date_modified: taxDocument.updatedAt,
      }]
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error getting tax document",
      error: error.message,
    })
  }
};

module.exports = {
  uploadDocument,
  getDocument,
};
