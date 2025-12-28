const mongoose = require('mongoose');

// Review Schema (Sub-document under Product)
// Stores customer feedback and ratings
const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Product Schema Definition
// Comprehensive model for store inventory, pricing, and availability
const productSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Admin who added the product
        },
        name: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
            default: 'Generic',
        },
        // Primary and secondary imagery
        image: {
            type: String,
            required: true,
        },
        images: [{
            type: String,
        }],
        category: {
            type: String,
            required: true, // e.g., 'Dairy, Bread & Eggs', 'Personal Care'
        },
        description: {
            type: String,
            required: true,
        },
        // Ratings and Reviews aggregation
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        // Pricing Logic
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        originalPrice: { type: Number, default: 0 }, // Used for showing discounts
        discount: { type: Number, default: 0 },      // Percentage off
        isDeal: { type: Boolean, default: false },   // Highlights as 'Flash Deal'
        // Inventory Management
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true, // Controls product visibility
        },
        // Image Moderation/Management Fields
        hasImage: {
            type: Boolean,
            default: false,
            required: true, // Critical for UI display
        },
        imageUploadedAt: {
            type: Date,
        },
        imageUploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual field: isPurchasable
// Logic: A product must have an image, be in stock, and be active to be bought
productSchema.virtual('isPurchasable').get(function () {
    return this.hasImage && this.countInStock > 0 && this.isActive;
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
