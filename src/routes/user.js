const express = require('express')
const userRouter = express.Router();

const USER_POPULATE_FIELDS = "firstName lastName age gender skills about"

const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user")
const { userAuth } = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');

userRouter.get('/user/requests', userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedUser._id,
      status: "interested"
    }).populate({ path: "fromUserId", select: "firstName lastName gender age about skills" })

    if (!connectionRequests) {
      throw new Error("no requests found")
    }

    res.json({ message: "request fetch is successful", data: connectionRequests })

  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedUser._id, status: "accepted" },
        { fromUserId: loggedUser._id, status: "accepted" }
      ]
    }).populate("fromUserId", USER_POPULATE_FIELDS).populate("toUserId", USER_POPULATE_FIELDS)

    const data = connectionRequest.map(key => {
      if (key.fromUserId._id.equals(loggedUser._id)) {
        return key.toUserId;
      }
      return key.fromUserId;
    })

    res.json({ data: data })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedUserId = new mongoose.Types.ObjectId(req.user._id)

    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit=limit>10 ? 10 : limit
    const skip = (page - 1) * limit;


    //find all user who have connections with logged user
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedUserId, },
        { toUserId: loggedUserId }
      ]
    }).select("fromUserId toUserid")

    const hideUsersFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId);
      hideUsersFromFeed.add(req.toUserId)
    })



    //get their ids
    // const connectedUserIds = connectionRequest.map(conn => {

    //   return conn.fromUserId.equals(loggedUserId) ? conn.toUserId : conn.fromUserId;
    // })

    //find all users who is not logggeruser and their id not in the connectionIds
    const users = await User.find({
      _id: {
        $nin: [...Array.from(hideUsersFromFeed), loggedUserId]
      }
    }).select(USER_POPULATE_FIELDS).skip(skip).limit(limit)

    res.json({
      message: "fetched new users successfully",
      data: users
    })

  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = userRouter;