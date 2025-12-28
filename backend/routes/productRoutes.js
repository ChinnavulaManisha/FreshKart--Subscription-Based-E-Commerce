const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
    createProductReview,
    uploadProductImage,
    deleteProductImage,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
    .route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct);

router.route('/:id/reviews').post(protect, createProductReview);

// Image upload routes
router.post('/:id/upload-image', protect, admin, upload.single('image'), uploadProductImage);
router.delete('/:id/image', protect, admin, deleteProductImage);

module.exports = router;
