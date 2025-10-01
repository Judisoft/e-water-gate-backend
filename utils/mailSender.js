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
      port: 465, // Use SSL port for Gmail
      secure: true, // Use SSL encryption
      auth: {
        user: "kumjude09@gmail.com", // Gmail address
        pass: "sdgv tadj owhp nopv", // Gmail app-specific password
      },
    });

    // Send e-mails to users
    let info = await transporter.sendMail({
      from: `"E-waterGate" <e-watergate@gmail.com>`, // Sender address
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
