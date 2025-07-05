const mongoose = require("mongoose");

const{Schema,model}=mongoose

const connectionRequestSchema = new Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"User"
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
     ref:"User",
  },
  status: {
    type: String,
    enum: {
      values: ["accepted", "rejected", "interested", "ignored"],
      message: `{VALUE} is invalid status` 
    }
  }}, 
  {timestamps: true}
);

connectionRequestSchema.index({fromUserId:1},{ toUserId:1})
connectionRequestSchema.pre("save",function(next) {
  const connectionRequest=this

  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("you cannot send request to yourself")
  }
  next();
})


const ConnectionRequest=model(
  "connectionModel",connectionRequestSchema
)

module.exports=ConnectionRequest