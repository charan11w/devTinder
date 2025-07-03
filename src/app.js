const express = require('express')
const app = express();
const connectDb = require('./config/database')

const cookieParser=require('cookie-parser')


app.use(express.json())
app.use(cookieParser())

const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")

app.use('/',authRouter,profileRouter,requestRouter)







connectDb()
  .then(() => {
    console.log("connection to db is successful")
    app.listen(7777, () => {
      console.log('server is listening on the port 7777...')
    })
  })
  .catch((err) => console.error("something went wrong: " + err.message))


