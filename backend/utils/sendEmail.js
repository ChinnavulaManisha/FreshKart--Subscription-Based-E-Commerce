const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if we have credentials
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'testuser@ethereal.email') {
        console.log('-----------------------------------------');
        console.log('📧 EMAIL LOG (No SMTP Configured):');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('-----------------------------------------');
        return; // Exit early
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Define email options
    const mailOptions = {
        from: `FreshKart <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
