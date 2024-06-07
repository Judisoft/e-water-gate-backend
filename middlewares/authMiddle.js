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
    //extract JWT token
    const token = req.headers.authorization.split(" ")[1]; // req.body.token || req.cookies.token;
    console.log(token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      console.log(req.user);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to perform this action. Login Again",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error Occured in Authentication",
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
    console.log(req.user);
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
