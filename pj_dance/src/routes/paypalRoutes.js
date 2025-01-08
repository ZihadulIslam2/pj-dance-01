const express = require('express');
const { createPayment, capturePayment } = require('../controllers/paypal.controller');
const router = express.Router();

// PayPal routes
router.post('/create-payment', createPayment);
router.post('/capture-payment', capturePayment);

module.exports = router;
