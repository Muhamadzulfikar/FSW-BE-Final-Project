const { createTransport } = require('nodemailer');
require('dotenv').config();

module.exports = async (emailUser, otpGenerated) => {
  const client = createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await client.sendMail({
    from: 'Skill Hub <noreply@gmail.com>',
    to: emailUser,
    subject: 'OTP Verification',
    html: `<p>${otpGenerated}</p>`,
  });
};
