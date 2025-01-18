const express = require('express');
const authMiddleware =  require('../middleware/authentication');
const serviceController = require('../controllers/services');
 
const router = express.Router();
router.get('/get-services' , serviceController.getServices);
router.post('/request-service', authMiddleware ,serviceController.requestService )
module.exports = router;