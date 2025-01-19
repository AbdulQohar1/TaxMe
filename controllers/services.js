const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Service = require('../models/services');
const { StatusCodes } = require('http-status-codes');

// offered services
// const services = [
//   {
//     "title": "Accounting services",
//     "service_id": "1",
//     "id": "8b59"
//   },
//   {
//     "title": "Attestation services",
//     "service_id": "2",
//     "id": "c19d"
//   },
//   {
//     "title": "Management consulting",
//     "service_id": "3",
//     "id": "421d"
//   },
//   {
//     "title": "Tax services",
//     "service_id": "3",
//     "id": "25d8"
//   },
//   {
//     "title": "Payment services",
//     "service_id": "4",
//     "id": "5b91"
//   },
// ];

const requestService = async (req, res) => {
  try {
    // get user email & token from headers
    const { email, authorization} = req.headers;
    
    // validate if user credentials are provided in headers
    const token = authorization.split(' ')[1];
    if (!email || !token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Failed to provide email and token in headers',
      });
    }

    // find user with the provided email
    const user = await User.findOne({ email });

    // check if user exists
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    // validate token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // check if email matches the provided token
    if (email !== decoded.email) {
      return  res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials; email and token mismatch.'
      });
    };

    // find the service
    const service = await Service.findOne({ isActive: true });

    if (!service) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No service found.'
      });
    }

    // if all validation pass, return the required data
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Service requested successfully.',
      data: {
        service_id: service.service_id,
        category: user.category,
        user_id: user._id,
        user_name: user.fullname,
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to process service request.'
    });
  }
};

const getServices = async ( req , res) => {
  try {
    // fetch services and its related informations
    const services = await Service.find({} , 'title  service_id');

    return res.status(StatusCodes.OK).json({
      success: true,
      services
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch services',
    });
  }
};

module.exports = {
  getServices,
  requestService
}