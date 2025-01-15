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
// ]

// /get-services - return {services: [{title, service_id}]}
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