const express=require('express')
const userRouter=express.Router();

const USER_POPULATE_FIELDS="firstName lastName age gender skills about"

const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../middlewares/auth');

userRouter.get('/user/requests',userAuth,async(req,res) => {
  try{
    const loggedUser=req.user;

    const connectionRequests=await ConnectionRequest.find({
      toUserId:loggedUser._id,
      status:"interested"
    }).populate({path:"fromUserId",select:"firstName lastName gender age about skills"})

    if(!connectionRequests){
      throw new Error("no requests found")
    }

    res.json({message:"request fetch is successful",data:connectionRequests})

  }catch(err){
    res.status(400).json({message:err.message})
  }
})

userRouter.get('/user/connections',userAuth,async(req,res) => {
  try{
    const loggedUser=req.user;

    const connectionRequest= await ConnectionRequest.find({
      $or:[
        {toUserId:loggedUser._id,status:"accepted"},
        {fromUserId:loggedUser._id,status:"accepted"}
      ]
    }).populate("fromUserId",USER_POPULATE_FIELDS).populate("toUserId",USER_POPULATE_FIELDS)

    const data=connectionRequest.map(key => {
      if( key.fromUserId._id.equals(loggedUser._id)){
        return key.toUserId;
      }
      return key.fromUserId;
    })

    res.json({data:data})
  }catch(err){
    res.status(400).json({message:err.message})
  }
})

module.exports=userRouter;