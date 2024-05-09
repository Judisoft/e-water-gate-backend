const bcrypt = require("bcrypt");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const { generateResetToken } = require("../utils/resetToken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

// signup handle
exports.signup = async (req, res) => {
  try {
    //get input data
    const { name, email, telephone, password, role, otp } = req.body;

    // Check if All Details are there or not
    if (!name || !email || !telephone || !password || !otp) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    //check if use already exists?
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log(response);
    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    //secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Hashing pasword error for ${password}: ` + error.message,
      });
    }

    const User = await user.create({
      name,
      email,
      telephone,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      User,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User registration failed",
    });
  }
};

exports.login = async (req, res) => {
  try {
    //data fetch
    const { email, password } = req.body;
    //validation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully",
      });
    }

    //check for registered User
    let User = await user.findOne({ email });
    //if user not registered or not found in database
    if (!User) {
      return res.status(401).json({
        success: false,
        message: "Email not registered",
      });
    }

    const payload = {
      email: User.email,
      id: User._id,
      role: User.role,
    };
    //verify password and generate a JWt token 🔎
    if (await bcrypt.compare(password, User.password)) {
      //if password matched
      //now lets create a JWT token
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP,
      });
      User = User.toObject();
      User.token = token;

      User.password = undefined;
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true, //It will make cookie not accessible on client side -> good way to keep hackers away
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        User,
        message: "Logged in Successfully",
      });
    } else {
      //password donot matched
      return res.status(403).json({
        success: false,
        message: "Password incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Login failure :" + error,
    });
  }
};

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await user.findOne({ email });
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Reset user password

exports.forgotpassword = async (req, res) => {
  // Route to handle password reset request
  const { email } = req.body;
  console.log(email);

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
      `Reset Link: <a href="http://localhost:3000/reset-password/${token}">Reset Password</a>`
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

exports.resetpassword = async (req, res) => {
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
