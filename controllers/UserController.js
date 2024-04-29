const user = require("../models/user");

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
