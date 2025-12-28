const asyncHandler = require('express-async-handler');
const Subscription = require('../models/Subscription');
const Order = require('../models/Order');

/**
 * @desc    Establish a new recurring delivery plan
 * @route   POST /api/subscriptions
 * @access  Private
 */
const createSubscription = asyncHandler(async (req, res) => {
    const { product, quantity, frequency, startDate, duration, endDate, billingType } = req.body;

    if (!product || !quantity || !frequency || !startDate) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    // Initialize delivery schedule starting from the requested date
    const nextDeliveryDate = new Date(startDate);

    const subscription = new Subscription({
        user: req.user._id,
        product,
        quantity,
        frequency,
        startDate,
        nextDeliveryDate,
        endDate,
        duration,
        billingType: billingType || 'Postpaid',
        status: 'active'
    });

    const createdSubscription = await subscription.save();
    res.status(201).json(createdSubscription);
});

/**
 * @desc    Fetch active and past plans for the current customer
 * @route   GET /api/subscriptions/my
 * @access  Private
 */
const getMySubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({ user: req.user._id }).populate('product');
    res.json(subscriptions);
});

/**
 * @desc    Fetch all system-wide subscriptions (Admin only)
 * @route   GET /api/subscriptions
 * @access  Private/Admin
 */
const getSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({}).populate('user', 'id name').populate('product', 'id name');
    res.json(subscriptions);
});

/**
 * @desc    Modify plan details or toggle status (Pause/Cancel)
 * @route   PUT /api/subscriptions/:id
 * @access  Private
 */
const updateSubscription = asyncHandler(async (req, res) => {
    const { status, quantity, frequency } = req.body;
    const subscription = await Subscription.findById(req.params.id);

    if (subscription) {
        // Validation: Verify ownership or admin rights
        if (subscription.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            res.status(401);
            throw new Error('Not authorized');
        }

        if (status) subscription.status = status;

        // Integration Logic: Sync cancellation with orders
        // If a subscription is cancelled, any non-shipped orders tied to it are also marked as Cancelled
        if (status === 'cancelled') {
            await Order.updateMany(
                { subscriptionId: subscription._id, orderStatus: { $in: ['Order Placed', 'Confirmed', 'Packed'] } },
                {
                    $set: { orderStatus: 'Cancelled' },
                    $push: {
                        trackingHistory: {
                            status: 'Cancelled',
                            date: Date.now(),
                            comment: 'Order cancelled due to subscription cancellation.'
                        }
                    }
                }
            );
        }
        if (quantity) subscription.quantity = quantity;
        if (frequency) subscription.frequency = frequency;

        const updated = await subscription.save();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error('Subscription not found');
    }
});

module.exports = {
    createSubscription,
    getMySubscriptions,
    getSubscriptions,
    updateSubscription
};
