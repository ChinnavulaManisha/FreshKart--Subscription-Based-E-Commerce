const express = require('express');
const router = express.Router();
const {
    createSubscription,
    getMySubscriptions,
    getSubscriptions,
    updateSubscription
} = require('../controllers/subscriptionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createSubscription).get(protect, admin, getSubscriptions);
router.route('/my').get(protect, getMySubscriptions);
router.route('/:id').put(protect, updateSubscription);

module.exports = router;
