const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 28
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 18
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others']
  },
  skills: {
    type: [String],
    default: []
  },
  about: {
    type: String,
    default: 'This is about me'
  },
  photoURL: {
    type: String,
    default: 'https://geographyandyou.com/images/user-profile.png'
  }
}, {
  timestamps: true
});

module.exports = model("User", userSchema);