const { randomInt } = require('crypto');

const generateOTP = () => {
  const otp = randomInt(100_000, 999_999);

  return otp;
};

module.exports = generateOTP;
