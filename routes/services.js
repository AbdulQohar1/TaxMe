const express = require('express');
const serviceController = require('../controllers/services');

const router = express.Router();
router.get('/get-services' , serviceController.getServices);

module.exports = router;