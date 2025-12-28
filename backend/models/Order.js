const mongoose = require('mongoose');

// Order Schema Definition
// Tracks customer purchases, financial details, and delivery progression
const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // Detailed list of products in this order
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                // Metadata for items that are part of a recurring plan
                isSubscription: { type: Boolean, default: false },
                frequency: { type: String },
                startDate: { type: Date },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String },
            postalCode: { type: String, required: true },
            landmark: { type: String },
            placeType: { type: String },
            country: { type: String, default: 'India' },
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'Cash on Delivery', // Options: 'UPI', 'Card', 'Cash on Delivery'
        },
        // Financial Breakdown
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0, // Final amount paid by customer
        },
        // Payment Tracking
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        // Delivery Status
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        // Link to underlying subscription if any
        subscriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subscription',
            required: false
        },
        // Detailed Order Lifecycle Status
        orderStatus: {
            type: String,
            required: true,
            default: 'Order Placed',
            enum: ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
        },
        codCharge: {
            type: Number,
            required: true,
            default: 0.0 // Convenience fee for Cash on Delivery
        },
        // Granular Tracking History for 'Track Order' UI
        trackingHistory: [
            {
                status: { type: String, required: true },
                date: { type: Date, default: Date.now },
                comment: { type: String }
            }
        ]
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
