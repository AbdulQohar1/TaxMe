const User = require('../models/user');
const Service = require('../models/services');
const { StatusCodes } = require('http-status-codes');
const services = require('../models/services');

// offered services
const services = [
  {
    "title": "Accounting services",
    "service_id": "1",
    "id": "8b59"
  },
  {
    "title": "Attestation services",
    "service_id": "2",
    "id": "c19d"
  },
  {
    "title": "Management consulting",
    "service_id": "3",
    "id": "421d"
  },
  {
    "title": "Tax services",
    "service_id": "3",
    "id": "25d8"
  },
  {
    "title": "Payment services",
    "service_id": "4",
    "id": "5b91"
  },
]

const requestService = async ( req , res) => {
 try {
   // get user email & token from headers
  const { email, token} = req.headers;

  // validate if user credentials are provided in headers
  if (! email || !token ) {
    return res.status(StatusCodes.json({
      success: false,
      message: 'Failed to provide useremail and usertoken in  headers',
    }));
  }

  // find user with the provided email
  const user = await User.find({ email});

  // check if user exists
  if (!user){
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'User not found'
    });
  }
 
  // validate token
  if (user.token !== token ) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid token',
    });
  }

  // find the service 
  const service = await Service.findOne({ })

  // if all validation pass, retur thee required data
  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Service requested successfully.',
    data: {
      // service_id: user.ser
    }
  }) 
 } catch (error) {
  
 }
 
}




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
  getServices
}