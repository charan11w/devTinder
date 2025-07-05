const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = (toEmail, otp) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Password Reset OTP',
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`
  });
};


const generateOtp=() => {
  return Math.floor(100000 + Math.random()*900000).toString()
}

module.exports = {sendOTPEmail,generateOtp};
