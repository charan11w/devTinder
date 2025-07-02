const express = require('express')
const app = express();
const connectDb = require('./config/database')
const User = require('./models/user')
const {validateSignUpData}=require('./utils/validation')
const bcrypt=require('bcrypt')
const cookieParser=require('cookie-parser')
const {userAuth}=require('../middlewares/auth')


app.use(express.json())
app.use(cookieParser())


//create user with signup
app.post('/signup', async (req, res) => {
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

app.post('/login',async(req,res)=>{
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
      res.cookie('token',token,{
        httpOnly:true,
        secure:true,
        expires:new Date(Date.now() + 24*60*60*1000)
      })
      res.send('login successfull!!')
    }else{
      throw new Error('Invalid Credentials')
    }
  }catch(err){
    res.status(400).json({error: err.message})
  }
})

app.get('/profile',userAuth,async(req,res)=> {

 try{
  const{user}=req
  res.send(user)
 }catch(err){
  res.status(400).send("ERROR : "+err.message)
 }
})

//get user by emailId
app.get('/user', async (req, res) => {
  console.log(req.body.emailId)
  try {
    const users = await User.find({ emailId: req.body.emailId })
    if (users.length === 0) {
      res.status(404).send("user not found")
    } else {
      res.send(users)
    }
  } catch (err) {
    res.status(400).send("something went wrong")
  }
})

//get - feed load all users with details
app.get("/feed", async (req, res) => {

  try {
    const users = await User.find({})
    if (users.length === 0) {
      res.status(404).send("user not found")
    } else {
      res.send(users)
    }
  } catch (err) {
    res.status(400).send("something went wrong")
  }
})

//delete user with userId 
app.delete('/user', async (req, res) => {
  const userId = req.body.userId

  try {
    const user = await User.findByIdAndDelete(userId)
    res.send("user deleted successfully")
  } catch (err) {
    res.status(400).send("something went wrong")
  }
})

//update user with emaliId/userId
app.patch('/user/:userId', async (req, res) => {
  const userId=req.params?.userId
  const data = req.body

  try {
    const ALLOWED_UPDATES = [
      'skills', 
      'gender', 
      'about', 
      'photoURL', 
      'age'
    ]
    const isUpdate = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k))

    if (!isUpdate) throw new Error("Error in Updating")

    if(data?.skiils.length>10) throw new Error ("Skills cannot be more than 10")
    const user = await User.findByIdAndUpdate(userId, data, { runValidators: true,returnDocument:'before' } )
    res.send("user updated successfully")
  } catch (err) {
    res.status(400).send("UPDATE FAILED: " + err.message)
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


