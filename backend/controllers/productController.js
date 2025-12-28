const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Fetch all products from the catalog
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

/**
 * @desc    Fetch details for a specific product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @desc    Permanently remove a product (Admin only)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @desc    Initialize a new product with default values
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
    } = req.body;

    const product = new Product({
        name: name || 'Sample name',
        price: price || 0,
        user: req.user._id,
        image: image || '/images/sample.jpg',
        brand: brand || 'Sample brand',
        category: category || 'Sample category',
        countInStock: countInStock || 0,
        description: description || 'Sample description',
        isActive: true,
        images: req.body.images || [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

/**
 * @desc    Modify existing product details
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        category,
        countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.brand = req.body.brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock; // Updates inventory count
        product.isActive = req.body.isActive !== undefined ? req.body.isActive : product.isActive;
        product.images = req.body.images || product.images;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @desc    Submit a rating and comment for a product
 * @route   POST /api/products/:id/reviews
 * @access  Private
 * Includes logic to prevent multiple reviews from the same user
 */
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        // Validation: one review per customer
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        // Recalculate average rating
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @desc    Handle local file upload for product image
 * @route   POST /api/products/:id/upload-image
 * @access  Private/Admin
 */
const uploadProductImage = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (!req.file) {
        res.status(400);
        throw new Error('No image file provided');
    }

    // File Management: Remove old custom image from disk if it exists
    if (product.image && product.image.startsWith('/uploads')) {
        const oldImagePath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    }

    // Save path of new image
    product.image = `/uploads/products/${req.file.filename}`;
    product.hasImage = true;
    product.imageUploadedAt = Date.now();
    product.imageUploadedBy = req.user._id;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
});

/**
 * @desc    Remove custom image and revert to category placeholder
 * @route   DELETE /api/products/:id/image
 * @access  Private/Admin
 */
const deleteProductImage = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Delete physically from server
    if (product.image && product.image.startsWith('/uploads')) {
        const imagePath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    // Revert to default placeholder logic based on category
    product.image = `/placeholders/${product.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    product.hasImage = false;
    product.imageUploadedAt = null;
    product.imageUploadedBy = null;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
});

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    uploadProductImage,
    deleteProductImage,
};
