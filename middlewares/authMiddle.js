const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth, isMember, isAdmin

/**
 * Authenticates the request using a JSON Web Token (JWT) from the Authorization header.
 *
 * @param {Object} req - The request object containing the headers.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */


exports.auth = (req, res, next) => {
  try {
    // Extract JWT token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during authentication",
    });
  }
};

/**
 * Checks if the user making the request is a member.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void}
 */

exports.isMember = (req, res, next) => {
  try {
    if (req.user.role !== "Member") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized Member",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something error occured: " + error,
    });
  }
};

/**
 * Checks if the user making the request is an admin.
 *
 * @param {Object} req - The request object containing the user object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the user is an admin, otherwise returns a JSON response with an error message.
 */

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized Admin",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something error occured⚠️: " + error,
    });
  }
};

/**
 * Checks if the user making the request is a system administrator.
 *
 * @param {Object} req - The request object containing the user object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} Calls the next middleware function if the user is a system administrator, otherwise returns a JSON response with an error message.
 */

exports.isSysAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "SysAdmin") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized SysAdmin⚠️",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something error occured⚠️: " + error,
    });
  }
};
