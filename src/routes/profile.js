const express=require("express")
const profileRouter=express.Router();
const {userAuth}=require('../../middlewares/auth')
const{validateEditProfileData}=require("../utils/validation")

profileRouter.get("/profile/view",userAuth,(req,res)=> {
  try{
    const {user}=req
    res.send(user)
  }catch(err){
    res.status(401).json({error:err.message})
  }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res) => {

  try{
    if(!validateEditProfileData(req)){
      throw new Error("Invalid Edit Request")
    }

    const loggedUser=req.user
    Object.keys(req.body).forEach(key => loggedUser[key] = req.body[key])

    await loggedUser.save();

    res.json({message:`${loggedUser.firstName}, Your profile edit is sucesssful`,data:loggedUser})
  }catch(err){
    res.status(400).json({error : err.message})
  }
})

module.exports=profileRouter;

