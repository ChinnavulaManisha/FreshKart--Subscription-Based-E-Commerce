/**
 * OTP Service
 * ───────────
 * Centralized OTP storage and verification logic.
 * Uses in-memory OTP_MAP (same as the original implementation).
 *
 * Methods:
 *   store(email, otp)    - Store OTP with 10-minute expiry
 *   verify(email, otp)   - Check if OTP is valid and not expired
 *   cleanup(email)       - Remove OTP after use
 *
 * Note: OTP_MAP is in-memory. For horizontal scaling,
 *       replace with Redis or a MongoDB TTL collection.
 */

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

// In-memory OTP storage (identical to original OTP_MAP)
const OTP_MAP = {};

const OtpService = {
    /**
     * Store a new OTP for the given email
     * @param {string} email - User's email address
     * @param {string} otp   - 6-digit OTP string
     */
    store(email, otp) {
        OTP_MAP[email] = {
            otp,
            expiresAt: Date.now() + OTP_EXPIRY_MS,
        };
    },

    /**
     * Verify if the provided OTP matches and is not expired
     * @param {string} email - User's email address
     * @param {string} otp   - OTP entered by user
     * @returns {boolean} true if valid, false otherwise
     */
    verify(email, otp) {
        const record = OTP_MAP[email];
        if (!record) return false;
        if (record.otp !== otp) return false;
        if (Date.now() > record.expiresAt) return false;
        return true;
    },

    /**
     * Remove OTP record after successful verification
     * @param {string} email - User's email address
     */
    cleanup(email) {
        delete OTP_MAP[email];
    },
};

module.exports = OtpService;
