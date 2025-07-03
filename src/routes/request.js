const express=require("express")
const requestRouter=express.Router();
const {userAuth}=require('../../middlewares/auth')

requestRouter.get('/sendConnectionRequest',userAuth,(req,res)=> {

  const user=req.user
  res.json({message : user.firstName + " sent a connection request"})
})

module.exports=requestRouter;