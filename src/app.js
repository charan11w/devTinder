const express = require('express')
const app = express();
const cookieParser=require('cookie-parser')
const cors=require('cors')

const connectDb = require('./config/database')



app.use(cors({
  origin: "https://dev-t-inder-ui.vercel.app",
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())

const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const userRouter=require("./routes/user")

app.use('/',authRouter,profileRouter,requestRouter,userRouter)





const PORT=process.env.PORT || 7777

connectDb()
  .then(() => {
    console.log("connection to db is successful")
    app.listen(PORT, () => {
      console.log('server is listening on the port 7777...')
    })
  })
  .catch((err) => console.error("something went wrong: " + err.message))


