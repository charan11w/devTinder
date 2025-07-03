const express=require("express")
const profileRouter=express.Router();
const {userAuth}=require('../../middlewares/auth')

profileRouter.get("/profile",userAuth,(req,res)=> {
  try{
    const {user}=req
    res.send(user)
  }catch(err){
    res.status(401).json({error:err.message})
  }
})

module.exports=profileRouter;

