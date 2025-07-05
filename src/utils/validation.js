const validator = require('validator')
const validateSignUpData = (req) => {

  const { firstName, lastName, emailId, password } = req.body

  if (!firstName || !lastName) {
    throw new Error("name is not valid")
  } else if (!validator.isEmail(emailId)) {
    throw new Error('email is not valid')
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("enter a strong password")
  }
}


const validateEditProfileData = (req) => {
  const ALLOWED_EDITS = [
    "firstName",
    "lastName",
    "emailId",
    "gender",
    "age",
    "skiils",
    "about",
    "photoURl"
  ]

  const isEditAllowed = Object.keys(req.body).every(fields => ALLOWED_EDITS.includes(fields))
  return isEditAllowed
}

module.exports = {
  validateSignUpData,
  validateEditProfileData
}