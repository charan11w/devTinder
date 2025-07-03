const express=require("express")
const authRouter=express.Router();
const User=require('../models/user')
const bcrypt=require('bcrypt')
const {validateSignUpData}=require('../utils/validation')

authRouter.post('/signup', async (req, res) => {
  try {

    //validation of data 
    validateSignUpData(req);

    const {firstName,lastName,emailId,password}=req.body
    //encrpt the password
    const passwordHash = await bcrypt.hash(password,10)
    const savedUser = await User.create({
      firstName,lastName,emailId,password:passwordHash
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

authRouter.post('/login',async(req,res)=>{
  try{
    const{emailId,password}=req.body

    const user=await User.findOne({emailId:emailId})
    if(!user){
      throw new Error("Invalid Credentials")
    }
    const isValidPassword=await user.validatePassword(password)
    if(isValidPassword){
      //creating jwt token
      const token=await user.getJWT();
      //attaching jwt token to cookies and sending it back with response
      res.cookie('token',token)
      res.send('login successfull!!')
    }else{
      throw new Error('Invalid Credentials')
    }
  }catch(err){
    res.status(400).json({error: err.message})
  }
})

module.exports=authRouter;