/**
 * Cryptographically Secure OTP Generator
 * ───────────────────────────────────────
 * Uses Node.js crypto.randomInt() for cryptographically secure random numbers.
 * This is superior to Math.random() which uses a PRNG and is NOT suitable
 * for security-sensitive operations.
 *
 * @param {number} length - Number of digits (default: 6)
 * @returns {string} OTP string with exact number of digits
 */
const crypto = require('crypto');

const generateOTP = (length = 6) => {
    const min = Math.pow(10, length - 1);  // 100000 for 6 digits
    const max = Math.pow(10, length);       // 1000000 for 6 digits
    return crypto.randomInt(min, max).toString();
};

module.exports = generateOTP;
