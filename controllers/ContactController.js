const Contact = require("./../models/Contact");

/**
 * Creates a new contact using the provided information from the request body.
 *
 * @param {Object} req - The request object containing the contact information.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} A JSON object with the success status and a message indicating the result of the operation.
 */

exports.postContact = async (req, res) => {
  try {
    const { userName, email, message } = req.body;
    if (!userName || !email || !message) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    const contact = await Contact.create({ userName, email, message });
    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
