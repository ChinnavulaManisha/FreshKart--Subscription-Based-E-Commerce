const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getMyOrders,
    getOrders,
    generateOrders,
    updateOrderToDelivered,
    getAnalyticsData,
    updateOrderStatus,
    getOrderById
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/my').get(protect, getMyOrders);
router.route('/analytics').get(protect, admin, getAnalyticsData);
router.route('/generate').post(generateOrders); // Open for demo, or protect
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
