const express = require("express")
const requestRouter = express.Router();


const { userAuth } = require('../../middlewares/auth')
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user");
const { default: mongoose } = require("mongoose");


requestRouter.get('/request/send/:status/:toUserId', userAuth, async (req, res) => {


   const fromUserId = req.user._id;
    const toUserId = req.params?.toUserId;
    const status = req.params?.status

    if(!mongoose.Types.ObjectId.isValid(toUserId)){
        return res.status(400).json({message:"Invalid toUser Id "})
    }

  try {

    const allowedStatus = ["interested", "ignored"]
    if (!allowedStatus.includes(status)) {
      throw new Error("invalid request status")
    }

    const toUser = await User.findById({ _id: toUserId })
    if (!toUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })

    if (existingConnectionRequest) {
      throw new Error("Connection request already exist!!")
    }
    const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status })
    const data = await connectionRequest.save();

    res.json({ message: "connceton sent  successfully" , data})

  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = requestRouter;