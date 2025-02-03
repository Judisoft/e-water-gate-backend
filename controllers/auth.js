const bcrypt = require("bcrypt");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { generateResetToken } = require("../utils/resetToken");
const mailSender = require("../utils/mailSender");
const { getDatabase, ref, set, get, child } = require("firebase/database");
const { v4: uuidv4 } = require("uuid"); // Import uuid library


require("dotenv").config();


exports.signUp = async (req, res) => {
  try {
    const {
      name,
      email,
      telephone,
      password,
      deviceId,
      consumptionType,
      location,
    } = req.body;

    // Check if all details are provided
    if (
      !name ||
      !email ||
      !telephone ||
      !password ||
      !deviceId ||
      !consumptionType ||
      !location
    ) {
      return res.status(403).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Get a reference to the Firebase database
    const database = getDatabase();
    const usersRef = ref(database, "users"); // Reference to the 'users' collection

    // Check if the user already exists
    const snapshot = await get(usersRef); // Fetch all users
    if (snapshot.exists()) {
      const usersObject = snapshot.val(); // Get users as an object
      const usersArray = Object.values(usersObject); // Convert object to an array

      // Check if any user has the provided email
      const userExists = usersArray.some((user) => user.email === email);

      if (userExists) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Check if the device ID is already in use
      const deviceIdExists = usersArray.some(
        (user) => user.deviceId === deviceId
      );

      if (deviceIdExists) {
        return res.status(409).json({
          success: false,
          message: "Device ID already in use",
        });
      }
    }

    // Generate a unique ID for the user
    const userId = uuidv4();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user data in Firebase
    const newUserRef = ref(database, `users/${userId}`);
    await set(newUserRef, {
      id: userId,
      name,
      email,
      telephone,
      password: hashedPassword,
      deviceId,
      consumptionType,
      location,
      role: "USER",
    });

    return res.status(200).json({
      success: true,
      message: "Account created successfully",
      userId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User registration failed",
    });
  }
};


exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Get a reference to the Firebase database
    const database = getDatabase();
    const usersRef = ref(database, "users");

    // Fetch all users and find the one with the matching email
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    let user = null;
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      if (userData.email === email) {
        user = userData;
      }
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email not registered",
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        success: false,
        message: "Password incorrect",
      });
    }

    // Generate JWT token
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP,
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        deviceId: user.deviceId,
        consumptionType: user.consumptionType,
        location: user.location,
        role: user.role,
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login failed: ${error.message}`,
    });
  }
};


// Reset user password

exports.forgotPassword = async (req, res) => {
  // Route to handle password reset request
  const { email } = req.body;
  try {
    // Find the user with the specified email
    const User = await user.findOne({ email });

    if (!User) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate a unique token for password reset and save it in the user document
    const token = generateResetToken();
    User.resetToken = token;
    User.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
    await User.save();

    // Send an email to the user with a link containing the token for password reset
    await mailSender(
      User.email,
      "Reset Password",
      `Reset Link: <a href="https://ballot-app.onrender.com/reset-password/${token}">Reset Password</a>`
    );

    res.json({
      success: true,
      token: token,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find the user with the specified token and check if it's still valid
    const User = await user.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!User) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    let hashedPassword;
    hashedPassword = await bcrypt.hash(password, 10);
    // Update the user's password
    User.password = hashedPassword;
    User.resetToken = undefined;
    User.resetTokenExpiration = undefined;
    await User.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
