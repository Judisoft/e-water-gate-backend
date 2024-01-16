const crypto = require('crypto');

exports.generateResetToken = () => {
  const token = crypto.randomBytes(20).toString('hex');
  return token;
}