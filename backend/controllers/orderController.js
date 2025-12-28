const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * @desc    Process a new checkout and create an order
 * @route   POST /api/orders
 * @access  Private
 * Also handles subscription initialization if items are marked as recurring
 */
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        codCharge
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        // Step 1: Validate stock availability for all items
        const stockErrors = [];
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                stockErrors.push(`Product "${item.name}" not found`);
            } else if (product.countInStock < item.qty) {
                stockErrors.push(`Insufficient stock for "${product.name}". Available: ${product.countInStock}, Requested: ${item.qty}`);
            }
        }

        // If any stock issues, reject the entire order
        if (stockErrors.length > 0) {
            res.status(400);
            throw new Error(`Cannot place order: ${stockErrors.join('; ')}`);
        }

        // Step 2: Reduce stock for all items
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            product.countInStock -= item.qty;
            await product.save();
        }

        // Step 3: Create initial order record
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            codCharge: codCharge || 0,
            isPaid: req.body.isPaid || false,
            paidAt: req.body.isPaid ? Date.now() : null,
            orderStatus: 'Order Placed',
            trackingHistory: [{
                status: 'Order Placed',
                date: Date.now(),
                comment: 'Your order has been placed successfully.'
            }]
        });

        const createdOrder = await order.save();

        // Step 4: Handle Subscription Logic
        // If an item in the cart is a subscription, create a recurring plan
        for (const item of orderItems) {
            if (item.isSubscription) {
                // Determine billing: UPI/Card = Prepaid, COD = Postpaid
                const billingType = paymentMethod === 'Cash on Delivery' ? 'Postpaid' : 'Prepaid';
                const subscription = new Subscription({
                    user: req.user._id,
                    product: item.product,
                    quantity: item.qty,
                    frequency: item.frequency || 'daily',
                    startDate: item.startDate || Date.now(),
                    nextDeliveryDate: item.startDate || Date.now(),
                    billingType,
                    status: 'active'
                });
                const savedSubscription = await subscription.save();

                // Link this specific order to the new subscription for status syncing
                createdOrder.subscriptionId = savedSubscription._id;
                await createdOrder.save();

                console.log(`Subscription created for user ${req.user._id} - Product: ${item.product}`);
            }
        }

        res.status(201).json(createdOrder);
    }
});

/**
 * @desc    Fetch order history for the current user
 * @route   GET /api/orders/my
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

/**
 * @desc    Fetch all store orders (Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
});

/**
 * @desc    Fetch technical and items details for a specific order
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        // Authorization: Prevents users from peeking at each other's orders
        if (req.user._id.equals(order.user._id) || req.user.isAdmin) {
            res.json(order);
        } else {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

/**
 * @desc    Background Task Trigger: Generate today's orders from active subscriptions
 * @route   POST /api/orders/generate
 * @access  Private/Admin
 * Scans for subscriptions due today and automatically creates corresponding Order records
 */
const generateOrders = asyncHandler(async (req, res) => {
    const today = new Date();
    // Identify due subscriptions
    const subscriptions = await Subscription.find({
        status: 'active',
        nextDeliveryDate: { $lte: today }
    }).populate('product').populate('user');

    if (subscriptions.length === 0) {
        return res.json({ message: 'No orders to generate due today.' });
    }

    const generatedOrders = [];

    for (const sub of subscriptions) {
        // Check stock availability before generating order
        if (sub.product.countInStock < sub.quantity) {
            console.log(`Skipping subscription order for ${sub.product.name} - Insufficient stock`);
            continue; // Skip this subscription if stock is insufficient
        }

        // Reduce stock
        sub.product.countInStock -= sub.quantity;
        await sub.product.save();

        // Auto-create order from subscription template
        const order = new Order({
            user: sub.user._id,
            orderItems: [{
                name: sub.product.name,
                qty: sub.quantity,
                image: sub.product.image,
                price: sub.product.price,
                product: sub.product._id
            }],
            shippingAddress: { address: sub.user.address || 'Default Address' },
            paymentMethod: 'Subscription',
            totalPrice: sub.product.price * sub.quantity,
            isPaid: false,
            subscriptionId: sub._id,
            orderStatus: 'Order Placed',
            trackingHistory: [{
                status: 'Order Placed',
                date: Date.now(),
                comment: 'Subscription order generated automatically.'
            }]
        });

        await order.save();
        generatedOrders.push(order);

        // Schedule next delivery based on frequency (Daily, Weekly, Monthly)
        const currentNext = new Date(sub.nextDeliveryDate);
        let nextDate = new Date(currentNext);

        if (sub.frequency === 'daily') {
            nextDate.setDate(nextDate.getDate() + 1);
        } else if (sub.frequency === 'weekly') {
            nextDate.setDate(nextDate.getDate() + 7);
        } else if (sub.frequency === 'monthly') {
            nextDate.setMonth(nextDate.getMonth() + 1);
        }

        sub.nextDeliveryDate = nextDate;
        await sub.save();
    }

    res.json({ message: `Generated ${generatedOrders.length} orders`, orders: generatedOrders });
});

/**
 * @desc    Quick administrative action to mark order as complete
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin
 */
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        // Validation: Cannot deliver a cancelled order
        if (order.orderStatus === 'Cancelled') {
            res.status(400);
            throw new Error('Cannot mark a cancelled order as delivered');
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.orderStatus = 'Delivered';

        // Auto-mark COD orders as paid upon delivery
        if (order.paymentMethod === 'Cash on Delivery' && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = Date.now();
        }

        order.trackingHistory.push({
            status: 'Delivered',
            date: Date.now(),
            comment: 'Package delivered to customer.'
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

/**
 * @desc    Detailed order lifecycle management (Confirmed -> Packed -> Shipped etc.)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, comment } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.orderStatus = status;

        // Auto-flag delivery flags if final status is reached
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            // Auto-mark COD orders as paid upon delivery
            if (order.paymentMethod === 'Cash on Delivery' && !order.isPaid) {
                order.isPaid = true;
                order.paidAt = Date.now();
            }
        }

        // Add to tracking timeline
        order.trackingHistory.push({
            status: status,
            date: Date.now(),
            comment: comment || `Order status updated to ${status}`
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

/**
 * @desc    Fetch store-wide summary for Admin Dashboard
 * @route   GET /api/orders/analytics
 * @access  Private/Admin
 */
const getAnalyticsData = asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const orders = await Order.find({ isPaid: true });
    // Aggregates net revenue from paid orders
    const totalSales = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    res.json({
        totalOrders,
        totalProducts,
        totalUsers,
        totalSales
    });
});

module.exports = {
    addOrderItems,
    getMyOrders,
    getOrders,
    generateOrders,
    updateOrderToDelivered,
    getAnalyticsData,
    updateOrderStatus,
    getOrderById
};
