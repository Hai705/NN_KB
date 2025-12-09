var express = require('express');
var router = express.Router();

// Import Controller Payment
// Đảm bảo bạn đã có file này trong thư mục controllers
var paymentController = require('../controllers/paymentController');

// Định nghĩa API: POST /payment/momo
router.post('/momo', paymentController.createMomoPayment);

module.exports = router;