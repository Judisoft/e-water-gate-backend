const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Asynchronously sends an email with the provided email, title, and body.
 *
 * @param {string} email - The email address of the recipient.
 * @param {string} title - The title of the email.
 * @param {string} body - The body content of the email.
 * @return {Promise<Object>} A Promise that resolves to an object containing the information about the sent email.
 */
const mailSender = async (email, title, body) => {
  try {
    // Create a transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Use Gmail's SMTP server
      port: 587, // Use the default port for Gmail
      secure: false, // Use TLS encryption
      auth: {
        type: "login",
        user: process.env.GMAIL_USER, // Gmail address
        pass: process.env.GMAIL_PASS, // Gmail password or app-specific password
      },
    });

    // Send e-mails to users
    let info = await transporter.sendMail({
      from: `"Ballot-App" <${process.env.GMAIL_USER}>`, // Sender address
      to: email, // Recipient address
      subject: title, // Subject line
      html: body, // HTML body content
    });

    console.log("Info is here: ", info);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

module.exports = mailSender;
