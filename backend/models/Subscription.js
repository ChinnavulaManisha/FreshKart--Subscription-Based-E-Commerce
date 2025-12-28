const mongoose = require('mongoose');

// Subscription Schema Definition
// Manages recurring orders, delivery schedules, and billing preferences
const subscriptionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        // Delivery Schedule Configuration
        frequency: {
            type: String,
            required: true,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'daily'
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date, // Optional: for fixed-duration plans
        },
        duration: {
            type: String, // Human-readable duration (e.g., '1 Week', '1 Month')
        },
        // Payment Strategy
        billingType: {
            type: String,
            required: true,
            enum: ['Prepaid', 'Postpaid'],
            default: 'Postpaid' // Prepaid is marked as "Paid" in UI
        },
        nextDeliveryDate: {
            type: Date,
            required: true // Used by seeder/background tasks to generate orders
        },
        // Lifecycle Status
        status: {
            type: String,
            required: true,
            enum: ['active', 'paused', 'cancelled'],
            default: 'active'
        }
    },
    {
        timestamps: true,
    }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
