/**
 * Email Service
 * ─────────────
 * Central email delivery service using Resend API.
 *
 * Design Principles:
 *   1. NEVER crashes the request — all errors are caught and logged
 *   2. Falls back to console logging when Resend is unavailable
 *   3. Structured logging for production observability
 *   4. Future-ready: add new email types without touching controllers
 *
 * Supported Email Types:
 *   ✅ OTP Verification   — sendOtpEmail(email, otp)
 *   🔜 Welcome Email      — sendWelcomeEmail(email, name)
 *   🔜 Order Confirmation — sendOrderConfirmation(email, order)
 *   🔜 Subscription       — sendSubscriptionReminder(email, sub)
 *   🔜 Password Reset     — sendPasswordResetEmail(email, token)
 *   🔜 Invoice            — sendInvoiceEmail(email, invoice)
 *   🔜 Newsletter         — sendNewsletter(emails, content)
 */

const { resendClient, EMAIL_FROM } = require('../config/resend');
const { buildOtpEmailHtml } = require('../templates/otpTemplate');

/**
 * ──────────────────────────────────────
 * Structured Logger
 * ──────────────────────────────────────
 */
const logOtpGenerated = (email, otp, status, reason = null) => {
    const timestamp = new Date().toISOString();
    console.log('──────────────────────────────────────');
    console.log('  OTP Generated');
    console.log('──────────────────────────────────────');
    console.log(`  Timestamp:    ${timestamp}`);
    console.log(`  Email:        ${email}`);
    console.log(`  OTP:          ${otp}`);
    console.log(`  Expires:      10 minutes`);
    console.log(`  Email Status: ${status}`);
    if (reason) {
        console.log(`  Reason:       ${reason}`);
    }
    console.log('──────────────────────────────────────');
};

const logEmailFailure = (email, error) => {
    const timestamp = new Date().toISOString();
    console.error('──────────────────────────────────────');
    console.error('  ❌ Email Delivery Failed');
    console.error('──────────────────────────────────────');
    console.error(`  Timestamp:  ${timestamp}`);
    console.error(`  To:         ${email}`);
    console.error(`  Reason:     ${error.message || 'Unknown error'}`);
    console.error(`  Fallback:   OTP printed to console`);
    console.error('──────────────────────────────────────');
};

/**
 * ──────────────────────────────────────
 * Email Service Methods
 * ──────────────────────────────────────
 */
const EmailService = {

    /**
     * Send OTP verification email
     * If Resend fails → logs error + prints OTP to console
     * NEVER throws — the caller always gets a resolved promise
     *
     * @param {string} email - Recipient email address
     * @param {string} otp   - 6-digit OTP code
     */
    async sendOtpEmail(email, otp) {
        // ─── No API key configured → Console fallback ───
        if (!resendClient) {
            logOtpGenerated(email, otp, 'Console Only (No RESEND_API_KEY)');
            return;
        }

        // ─── Send via Resend API ───
        try {
            const html = buildOtpEmailHtml(otp);

            const { data, error } = await resendClient.emails.send({
                from: EMAIL_FROM,
                to: [email],
                subject: 'FreshKart - Verify Your Email',
                html: html,
                text: `Your FreshKart verification code is: ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,
            });

            if (error) {
                throw new Error(error.message || 'Resend API returned an error');
            }

            logOtpGenerated(email, otp, `✅ Sent via Resend (ID: ${data?.id || 'N/A'})`);

        } catch (error) {
            // ─── Graceful Fallback ───
            logEmailFailure(email, error);
            logOtpGenerated(email, otp, 'Console Fallback (Resend failed)');
            // Do NOT re-throw — request continues normally
        }
    },

    /**
     * Generic email sender (backward compatible with old sendEmail interface)
     * Used if any part of the codebase still calls sendEmail({ email, subject, message, html })
     *
     * @param {Object} options - { email, subject, message, html }
     */
    async sendGenericEmail(options) {
        if (!resendClient) {
            console.log('──────────────────────────────────────');
            console.log(`📧 EMAIL LOG (No RESEND_API_KEY):`);
            console.log(`   To:      ${options.email}`);
            console.log(`   Subject: ${options.subject}`);
            console.log(`   Message: ${options.message}`);
            console.log('──────────────────────────────────────');
            return;
        }

        try {
            const { data, error } = await resendClient.emails.send({
                from: EMAIL_FROM,
                to: [options.email],
                subject: options.subject,
                html: options.html || `<p>${options.message}</p>`,
                text: options.message,
            });

            if (error) {
                throw new Error(error.message || 'Resend API error');
            }

            console.log(`✅ Email sent to ${options.email} (ID: ${data?.id || 'N/A'})`);

        } catch (error) {
            console.error(`❌ Email failed to ${options.email}:`, error.message);
            console.log('──────────────────────────────────────');
            console.log(`📧 FALLBACK LOG:`);
            console.log(`   To:      ${options.email}`);
            console.log(`   Subject: ${options.subject}`);
            console.log(`   Message: ${options.message}`);
            console.log('──────────────────────────────────────');
        }
    },

    // ─── Future Email Methods (stubs) ───

    // async sendWelcomeEmail(email, name) { },
    // async sendOrderConfirmation(email, order) { },
    // async sendSubscriptionReminder(email, subscription) { },
    // async sendPasswordResetEmail(email, resetToken) { },
    // async sendInvoiceEmail(email, invoice) { },
    // async sendNewsletter(emails, content) { },
};

module.exports = EmailService;
