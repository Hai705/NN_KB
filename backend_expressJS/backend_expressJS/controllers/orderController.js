const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')
const User = require('../models/User')
const Product = require('../models/Product')
const Cart = require('../models/Cart')
const Size = require('../models/Size')
const Bluebird = require('bluebird')

// Hàm hỗ trợ tìm kiếm và phân trang
const searchOrder = async (querySearch, limit, page) => {
    const orderSearch = await Order.find(querySearch)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user')
        .sort('-_id') // Sắp xếp đơn mới nhất lên đầu
        .lean()

    return Bluebird.map(orderSearch, async (item) => {
        const orderItems = await OrderItem.find({ order: { $in: item._id } }).populate('product').lean()
        const totalPrice = orderItems.reduce((total, item) => {
            return total + item.quantity * item.price
        }, 0)
        return { ...item, totalPrice, items: orderItems }
    }, { concurrency: orderSearch.length })
}

const searchOrderPage = async (querySearch, limit = 50, page = 1) => {
    const vLimit = parseInt(limit)
    const vPage = parseInt(page)
    const { status, cancel, user } = { ...querySearch }
    
    // --- SỬA ĐOẠN NÀY ĐỂ HIỂN THỊ "TẤT CẢ GIAO DỊCH" ---
    const query = { user } // Mặc định chỉ tìm theo User

    // Chỉ thêm điều kiện cancel nếu Frontend có gửi lên
    // (Nếu không gửi -> cancel là undefined -> Không thêm vào query -> Lấy tất cả)
    if (cancel !== undefined && cancel !== null && cancel !== '') {
        query.cancel = cancel
    }

    // Tương tự với status
    if (status !== undefined && status !== null && status !== '') {
        query.status = status
    }
    // ----------------------------------------------------

    const [listOrder, totalItem] = await Bluebird.all([searchOrder(query, vLimit, vPage), Order.countDocuments(query)])
    const pages = Math.ceil(totalItem / vLimit);
    return { listOrder, totalItem, pages };
}

// API Lấy danh sách đơn hàng
const getOrder = async (req, res, next) => {
    try {
        const { status, user, cancel, limit, page } = { ...req.query }
        console.log("query received:", req.query)
        const listOrder = await searchOrderPage({ status, user, cancel }, limit, page)
        res.status(200).json({ success: true, listOrder })
    }
    catch (error) {
        next(error)
    }
}

// API Tạo đơn hàng
const createOrder = async (req, res, next) => {
    try {
        const { infoOrder, cartItem } = { ...req.body }
        
        // 1. Tạo đơn hàng
        const newOrder = await Order.create(infoOrder);
        // console.log("cartItem: ", cartItem)
        
        // 2. Tạo chi tiết đơn hàng
        const newOrderItem = cartItem.map(item => ({
            order: newOrder._id,
            ...item,
        }))
        const createOrderItem = await OrderItem.create(newOrderItem)
        
        // 3. Trừ tồn kho
        await Bluebird.map(cartItem, async (item) => {
            await Size.updateOne(
                { product: item.product, size: item.size },
                { $inc: { numberInStock: -item.quantity } }
            )
        }, { concurrency: cartItem.length })
        
        // 4. Xóa giỏ hàng
        const cartId = cartItem.map(item => ({
            _id: item.cartId
        }))
        await Cart.deleteMany({ _id: { $in: cartId } })

        // Trả về newOrder để Frontend lấy ID
        res.status(200).json({ success: true, newOrder, createOrderItem, status: "ok" })
    } catch (error) {
        next(error)
    }
}

// API Hủy đơn hàng (Thủ công hoặc Admin)
const cancelOrder = async (req, res, next) => {
    try {
        const { cancel, orderId } = { ...req.body }
        await Order.updateOne({ _id: orderId }, { $set: { cancel } })
        
        // Hoàn trả tồn kho nếu hủy
        if (cancel === true || cancel === 'true') {
            const orderItems = await OrderItem.find({ order: orderId }).lean()
            await Bluebird.map(orderItems, async (item) => {
                await Size.updateOne(
                    { product: item.product, size: item.size },
                    { $inc: { numberInStock: item.quantity } }
                )
            }, { concurrency: orderItems.length })
        }

        res.status(200).json({ success: true, status: "ok" })
    }
    catch (error) {
        next(error)
    }
}

// API Hủy đơn hàng tự động do MoMo thất bại
const cancelOrderMoMo = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        // 1. Cập nhật trạng thái: Hủy đơn (cancel=true) và Chưa thanh toán (status=false)
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { cancel: true, status: false },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // 2. Hoàn trả lại tồn kho
        const orderItems = await OrderItem.find({ order: orderId }).lean()
        await Bluebird.map(orderItems, async (item) => {
            await Size.updateOne(
                { product: item.product, size: item.size },
                { $inc: { numberInStock: item.quantity } } 
            )
        }, { concurrency: orderItems.length })

        res.status(200).json({ 
            success: true, 
            message: 'Đã hủy đơn hàng và hoàn tồn kho do thanh toán thất bại', 
            data: updatedOrder 
        });
    } catch (error) {
        console.error("Lỗi hủy đơn MoMo:", error);
        next(error);
    }
};

module.exports = {
    createOrder,
    getOrder,
    cancelOrder,
    cancelOrderMoMo 
}