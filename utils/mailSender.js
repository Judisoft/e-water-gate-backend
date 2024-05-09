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
    //create a transporter
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, //-> Host SMTP detail
      auth: {
        user: process.env.MAIL_USER, //-> User's mail for authentication
        pass: process.env.MAIL_PASS, //-> User's password for authentication
      },
    });

    //now Send e-mails to users
    let info = await transporter.sendMail({
      from: `"Ballot-App" <${process.env.MAIL_SENDER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("Info is here: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mailSender;
