/**
 * OTP Email Template
 * ──────────────────
 * Professional, responsive HTML email template for OTP verification.
 * Compatible with all major email clients (Gmail, Outlook, Apple Mail, Yahoo).
 * Uses table-based layout for maximum email client compatibility.
 *
 * @param {string} otp - The 6-digit verification code
 * @returns {string} Complete HTML email string
 */
const buildOtpEmailHtml = (otp) => {
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>FreshKart - Email Verification</title>
    <!--[if mso]>
    <style>body, table, td { font-family: Arial, Helvetica, sans-serif !important; }</style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f0fdf4; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">

    <!-- Outer Container -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f0fdf4; padding: 40px 16px;">
        <tr>
            <td align="center">

                <!-- Email Card -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 32px rgba(5, 150, 105, 0.08);">

                    <!-- ═══════════ Header ═══════════ -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%); padding: 36px 40px; text-align: center;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center">
                                        <div style="font-size: 36px; line-height: 1;">🛒</div>
                                        <h1 style="margin: 12px 0 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase;">
                                            FreshKart
                                        </h1>
                                        <p style="margin: 6px 0 0; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.8); letter-spacing: 1px; text-transform: uppercase;">
                                            Farm Fresh &bull; Delivered Daily
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- ═══════════ Body ═══════════ -->
                    <tr>
                        <td style="padding: 40px 36px 16px;">

                            <!-- Welcome -->
                            <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #111827; text-align: center; line-height: 1.3;">
                                Verify Your Email Address
                            </h2>
                            <p style="margin: 0 0 32px; font-size: 15px; color: #6b7280; text-align: center; line-height: 1.7;">
                                Welcome to FreshKart! Please enter the verification code below to complete your registration.
                            </p>

                            <!-- ── OTP Code Box ── -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 28px;">
                                <tr>
                                    <td align="center">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 2px solid #6ee7b7; border-radius: 14px; width: 100%;">
                                            <tr>
                                                <td style="padding: 28px 24px; text-align: center;">
                                                    <p style="margin: 0 0 10px; font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 3px;">
                                                        Your Verification Code
                                                    </p>
                                                    <div style="font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #065f46; font-family: 'Courier New', 'Lucida Console', monospace; padding: 6px 0; line-height: 1.2;">
                                                        ${otp}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- ── Expiry Warning ── -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 20px;">
                                <tr>
                                    <td style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 14px 18px;">
                                        <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600; line-height: 1.5;">
                                            &#9201; This code expires in <strong>10 minutes</strong>. Do not refresh the page.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- ── Security Notice ── -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 20px;">
                                <tr>
                                    <td style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 0 8px 8px 0; padding: 14px 18px;">
                                        <p style="margin: 0; font-size: 13px; color: #991b1b; font-weight: 500; line-height: 1.5;">
                                            &#128274; <strong>Security Warning:</strong> Never share this code with anyone. FreshKart will never ask for your OTP via phone, SMS, or chat.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- ── Ignore Notice ── -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 8px;">
                                <tr>
                                    <td style="background-color: #f1f5f9; border-radius: 8px; padding: 14px 18px;">
                                        <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                                            If you didn't create an account on FreshKart, you can safely ignore this email. No action is required.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- ═══════════ Divider ═══════════ -->
                    <tr>
                        <td style="padding: 0 36px;">
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 8px 0 0;" />
                        </td>
                    </tr>

                    <!-- ═══════════ Footer ═══════════ -->
                    <tr>
                        <td style="padding: 24px 36px 32px; text-align: center;">
                            <p style="margin: 0 0 6px; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                                This is an automated message from FreshKart.
                            </p>
                            <p style="margin: 0 0 12px; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                                Please do not reply to this email.
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #d1d5db;">
                                &copy; ${year} FreshKart. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

                <!-- Pre-header spacer -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px;">
                    <tr>
                        <td style="padding: 20px 0; text-align: center;">
                            <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                                Sent with &#x2764;&#xfe0f; from FreshKart
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</body>
</html>`;
};

module.exports = { buildOtpEmailHtml };
