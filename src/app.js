const express = require('express')
const app = express();
const connectDb = require('./config/database')

connectDb()
  .then(() => {
    console.log("connection to db is successful")
    app.listen(7777, () => {
      console.log('server is listening on the port 7777...')
    })
  })
  .catch(() => console.error("something went wrong"))


