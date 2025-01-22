const express = require('express');
const authMiddleware =  require('../middleware/authentication');
const receiptController = require('../controllers/receipt');

const router = express.Router();
router.post('create-receipt' , authMiddleware, receiptController.createReceipt);
router.post('get-receipt' , authMiddleware, receiptController.getReceipts);