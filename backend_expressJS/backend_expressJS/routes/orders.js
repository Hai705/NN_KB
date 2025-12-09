var express = require('express')
var router = express.Router()
var OrderController = require('../controllers/orderController')
var OrderAdminController = require('../controllers/orderAdminController')

// Tạo đơn hàng
router.post('/', OrderController.createOrder)

// Lấy danh sách đơn hàng (User)
router.get('/', OrderController.getOrder)

// Lấy danh sách đơn hàng (Admin)
router.get('/admin', OrderAdminController.getOrder)

// Admin cập nhật trạng thái
router.put('/admin/status', OrderAdminController.acceptStatus)

// Hủy đơn hàng (User tự hủy thủ công)
router.put('/', OrderController.cancelOrder)

// ============================================================
// MỚI THÊM: Route hủy đơn tự động khi MoMo báo lỗi
// ============================================================
router.post('/cancel-momo', OrderController.cancelOrderMoMo)

module.exports = router