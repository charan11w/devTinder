const jwt = require('jsonwebtoken')
const User = require('../models/user')
const userAuth = async (req, res, next) => {

  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Please Login !")
    }

    const decodedObj = jwt.verify(token, 'Narahc@123')

    const { _id } = decodedObj

    const user = await User.findById(_id)
    if (!user) {
      throw new Error("User does not exist")
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({error: err.message})
  }
}

module.exports = {
  userAuth
}