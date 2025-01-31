const { getDatabase, ref, set, get, child } = require("firebase/database");

/**
 * Retrieves all users from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<Object>} A JSON object containing the success status and the list of users.
 * If the operation is successful, the success status is true and the list of users is returned.
 * If an error occurs, the success status is false and an error message is returned.
 */

exports.getSingleUser = async (req, res) => {
  try {
    const userId = req.params.user_id;
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Get a reference to the Firebase database
    const database = getDatabase();
    const usersRef = ref(database, "users"); // Reference to the 'users' collection

    // Check if user with userId exists
    const snapshot = await get(child(usersRef, userId));
    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = snapshot.val();
    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something error occured⚠️: " + error,
    });
    
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Get a reference to the Firebase database
    const database = getDatabase();
    const usersRef = ref(database, "users"); // Reference to the 'users' collection

    // Fetch all users
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    const usersObject = snapshot.val(); // Get users as an object
    const usersArray = Object.values(usersObject); // Convert object to an array

    return res.status(200).json({
      success: true,
      users: usersArray,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something error occured⚠️: " + error,
    });
  }
}
