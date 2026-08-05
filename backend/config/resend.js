/**
 * Resend Email Client Configuration
 * ──────────────────────────────────
 * Initializes the Resend SDK with the API key from environment variables.
 * Returns null if no API key is configured (graceful degradation).
 *
 * Environment Variables:
 *   RESEND_API_KEY  - Required for email delivery
 *   EMAIL_FROM      - Sender address (defaults to Resend sandbox)
 */
const { Resend } = require('resend');

let resendClient = null;

if (process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
    console.log('✅ Resend email client initialized successfully');
} else {
    console.warn('⚠️  RESEND_API_KEY not found — emails will be logged to console');
}

/**
 * Default sender address
 * Use a verified domain in production (e.g., noreply@freshkart.com)
 * Falls back to Resend sandbox for development/testing
 */
const EMAIL_FROM = process.env.EMAIL_FROM || 'FreshKart <onboarding@resend.dev>';

module.exports = { resendClient, EMAIL_FROM };
