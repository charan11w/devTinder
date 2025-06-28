const express = require('express')
const app = express();
const connectDb = require('./config/database')
const User=require('./models/user')


app.use(express.json())


//create user with signup
app.post('/signup',async(req,res)=>{
  try{
    const userData=req.body;
    const savedUser=await User.create(userData)
    // const newUser=await User(userData)
    // const savedUser=await newUser.save()

    res.status(201).json({
      message:'User Created Successfully',
      user:savedUser
    })
  }catch(err){
    res.status(400).send("bad request" + err.message);
  }
})

//get user by emailId
app.get('/user',async(req,res)=>{
    console.log(req.body.emailId)
  try{
    const users= await User.find({emailId:req.body.emailId})
    if(users.length === 0){
      res.status(404).send("user not found")
    }else{
      res.send(users)
    }
  }catch(err){
    res.status(400).send("something went wrong")
  }
})

//get - feed load all users with details
app.get("/feed",async(req,res)=>{

  try{
    const users= await User.find({})
    if(users.length === 0){
      res.status(404).send("user not found")
    }else{
      res.send(users)
    }
  }catch(err){
    res.status(400).send("something went wrong")
  }
})

//delete user with userId 
app.delete('/user',async(req,res)=> {
    const userId=req.body.userId
    
    try{
      const user=  await User.findByIdAndDelete(userId)
      res.send("user deleted successfully")
    }catch(err){
      res.status(400).send("something went wrong")
    }
})

//update user with emaliId
app.patch('/user',async(req,res)=> {
    const emailId=req.body.emailId
    const data=req.body
    
    try{
      const user=  await User.updateOne(emailId,data,{runValidators:true})
      res.send("user updated successfully")
    }catch(err){
      res.status(400).send("something went wrong" + err.message)
    }
})


connectDb()
  .then(() => {
    console.log("connection to db is successful")
    app.listen(7777, () => {
      console.log('server is listening on the port 7777...')
    })
  })
  .catch((err) => console.error("something went wrong" + err.message))


