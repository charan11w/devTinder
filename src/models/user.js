const mongoose = require('mongoose')
const validator=require('validator')
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
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
  },
 otp:String,
 otpExpire:Date
}, {
  timestamps: true
});

userSchema.methods.getJWT=function(){
  const user=this;
  const token =jwt.sign({_id:user._id},"Narahc@123",{
    expiresIn:'1d'
  })

  return token;
}

userSchema.methods.validatePassword= async function(passwordInputByUser){
  const user=this
  const passwordHash=user.password
  const isPasswordValid=await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  )

  return isPasswordValid;
}

module.exports = model("User", userSchema);