const express = require('express')
const app = express();
const cookieParser=require('cookie-parser')
const cors=require('cors')

const connectDb = require('./config/database')



app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())

const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const userRouter=require("./routes/user")

app.use('/',authRouter,profileRouter,requestRouter,userRouter)







connectDb()
  .then(() => {
    console.log("connection to db is successful")
    app.listen(7777, () => {
      console.log('server is listening on the port 7777...')
    })
  })
  .catch((err) => console.error("something went wrong: " + err.message))


