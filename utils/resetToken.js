const crypto = require("crypto");

/**
 * Generates a random reset token using cryptographic random bytes.
 *
 * @return {string} The generated reset token.
 */

exports.generateResetToken = () => {
  const token = crypto.randomBytes(20).toString("hex");
  return token;
};
