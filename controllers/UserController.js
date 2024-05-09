const user = require("../models/user");

/**
 * Retrieves all users from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} A JSON object containing the success status and the list of users.
 * If the operation is successful, the success status is true and the list of users is returned.
 * If an error occurs, the success status is false and an error message is returned.
 */

exports.getAllUsers = async (req, res) => {
  try {
    const users = await user.find({});

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Operation failed! Try again",
    });
  }
};
