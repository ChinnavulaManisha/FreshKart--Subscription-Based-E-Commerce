/**
 * sendEmail - Backward Compatible Wrapper
 * ────────────────────────────────────────
 * This file preserves the original sendEmail({ email, subject, message, html })
 * function signature for backward compatibility.
 *
 * Internally delegates to EmailService.sendGenericEmail().
 *
 * If any part of the codebase still imports sendEmail from this file,
 * it will continue to work exactly as before.
 */

const EmailService = require('../services/emailService');

const sendEmail = async (options) => {
    await EmailService.sendGenericEmail(options);
};

module.exports = sendEmail;
