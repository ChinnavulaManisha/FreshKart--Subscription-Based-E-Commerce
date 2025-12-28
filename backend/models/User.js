const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema Definition
// Stores all information related to customers and administrators
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensures no two users share the same email
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false, // Normal users by default, set true for manual admin creation
        },
        // Multiple Address Support
        // Allows users to save different addresses (Home, Office, etc.)
        addresses: [{
            name: { type: String, required: true },
            phone: { type: String, required: true },
            altPhone: { type: String },
            addressLine: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, default: 'India' },
            landmark: { type: String },
            placeType: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
            isDefault: { type: Boolean, default: false }
        }],
        // Legacy Fields (kept for backward compatibility with simple profiles)
        address: { type: String, default: '' },
        phone: { type: String, default: '' }
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

// Method to verify provided password against the hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware: Hashing password before saving to database
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    // Generate a salt and hash the plaintext password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
