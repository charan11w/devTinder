const mongoose = require('mongoose')
const validator=require('validator')
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
    lowercase:true,
     set:(value) => value.replace(/\s+/g,''),
    validate(value){
      if(!validator.isEmail(value))  throw new Error('Invalid emial address : '+value)
    },
   
  },
  password: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)) throw new Error ('Enter a Strong Password : '+value)
    }
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
    default: 'https://geographyandyou.com/images/user-profile.png',
     validate(value){
      if(!validator.isURL(value))  throw new Error('Invalid image address : '+value)
    }
  }
}, {
  timestamps: true
});

module.exports = model("User", userSchema);