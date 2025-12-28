const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/users/login
 * @access  Public
 * handles both Customer and Admin logins based on 'role' field
 */
const authUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Account does not exist. Please register first.');
    }

    // Security check: Ensure account permissions match the selected login tab
    if (role === 'admin' && !user.isAdmin) {
        res.status(401);
        throw new Error('This account does not have Admin privileges. Please login as a Customer.');
    }

    if (role === 'user' && user.isAdmin) {
        res.status(401);
        throw new Error('This is an Admin account. Please login using the Admin tab.');
    }

    // Verify password using schema method
    if (await user.matchPassword(password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
            address: user.address,
            phone: user.phone
        });
    } else {
        res.status(401);
        throw new Error('Invalid password. Please try again.');
    }
});

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        address
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
            address: user.address,
            phone: user.phone
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            addresses: user.addresses, // Returns the full list of saved addresses
            address: user.address,
            phone: user.phone
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc    Update user profile & addresses
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        // Synchronize updated address book
        if (req.body.addresses) {
            user.addresses = req.body.addresses;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
            addresses: updatedUser.addresses
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const sendEmail = require('../utils/sendEmail');

// Temporary in-memory OTP storage
// Note: In production, use Redis or a DB table with auto-TTL
const OTP_MAP = {};

/**
 * @desc    Generate and send 6-digit OTP for registration
 * @route   POST /api/users/send-otp
 * @access  Public
 */
const sendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    console.log(`Backend: OTP request received for ${email}`);

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Validation: Only @gmail.com addresses are supported
    if (!email.endsWith('@gmail.com')) {
        res.status(400);
        throw new Error('Only @gmail.com addresses are supported');
    }

    // Generate 6-digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    OTP_MAP[email] = {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000, // Valid for 10 minutes
    };

    try {
        await sendEmail({
            email,
            subject: 'FreshKart - Verify Your Email',
            message: `Your verification code is: ${otp}. It expires in 10 minutes.`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; max-width: 500px; margin: auto;">
                    <h2 style="color: #10b981; text-align: center;">FreshKart Verification</h2>
                    <p>Welcome to FreshKart! Use the code below to verify your email address:</p>
                    <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a1a1a; margin: 20px 0;">${otp}</div>
                    <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                   </div>`,
        });

        // Developer Logging: Prints OTP to terminal if SMTP is not configured
        if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'testuser@ethereal.email') {
            console.log(`otp = ${otp}`);
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500);
        throw new Error('Email delivery failed. Please check backend console if using test account.');
    }
});

/**
 * @desc    Verify the 6-digit OTP provided by the user
 * @route   POST /api/users/verify-otp
 * @access  Public
 */
const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const record = OTP_MAP[email];

    // Check for existence, match, and expiration
    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
        res.status(400);
        throw new Error('Invalid or expired verification code');
    }

    // Cleanup: Remove OTP after successful use
    delete OTP_MAP[email];
    res.status(200).json({ message: 'Email verified successfully' });
});

/**
 * @desc    Get all users list
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc    Get specific user profile by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc    Update any user account data
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = { authUser, registerUser, getUserProfile, updateUserProfile, sendOTP, verifyOTP, getUsers, deleteUser, getUserById, updateUser };
