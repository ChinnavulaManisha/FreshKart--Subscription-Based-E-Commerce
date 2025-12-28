const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, updateUserProfile, sendOTP, verifyOTP, getUsers, deleteUser, getUserById, updateUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser);

module.exports = router;
