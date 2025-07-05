const express = require("express")
const authRouter = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { validateSignUpData } = require('../utils/validation')
const { sendOTPEmail, generateOtp } = require("../utils/mailer")


authRouter.post('/signup', async (req, res) => {
  try {

    //validation of data 
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body
    //encrpt the password
    const passwordHash = await bcrypt.hash(password, 10)
    const savedUser = await User.create({
      firstName, lastName, emailId, password: passwordHash
    })
    // const newUser=await User(userData)
    // const savedUser=await newUser.save()

    res.status(201).json({
      message: 'User Created Successfully',
      user: savedUser
    })
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
})

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body

    const user = await User.findOne({emailId : emailId})
    if (!user) {
      throw new Error("Invalid Credentials ok")
    }
    const isValidPassword = await user.validatePassword(password)
    if (isValidPassword) {
      //creating jwt token
      const token = await user.getJWT();
      //attaching jwt token to cookies and sending it back with response
      res.cookie('token', token)
      res.send('login successfull!!')
    } else {
      throw new Error('Invalid Credentials')
    }
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

authRouter.post('/logout', (req, res) => {
  res.cookie("token", null,
    { expires: new Date(Date.now()) }
  )

  res.json({ message: "logout is successful" })
})

authRouter.post("/forgot-password", async (req, res) => {

  const { email } = req.body;
  console.log(email)

  try {

    const user = await User.findOne({ emailId:email });
    if (!user) throw new Error("User not Found")


    const otp=generateOtp();
    user.otp =otp
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();


    await sendOTPEmail(email, otp);

    res.json({ message: "Otp sent to your email" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

})

authRouter.post("/reset-password",async(req,res) => {
  const { emailId, otp, newPassword}=req.body;

 try{ const user=await User.findOne({emailId:emailId});
    if (!user) throw new Error("User not found")

    if(user.otp !==otp){
      throw new Error("Invalid otp")
    }

    if(Date.now() > user.otpExpire){
      throw new Error("Otp has Expired")
    }


    const newHashedPassword=await bcrypt.hash(newPassword,10)
    user.password=newHashedPassword;
    user.otp=undefined;
    user.otpExpire=undefined;
    await user.save()

    res.json({message:"Password reset is Successful"})
  }catch(err){
    res.status(500).json({error:err.message})
  }
})

module.exports = authRouter;