const express=require('express')
const app=express();


app.use('/test',(req,res) => {
  res.send("this is test")
})

app.use('/user',(req,res) => {
  res.send("this is user")
})


app.use('/',(req,res) => {
  res.send("this is dashboard")
})


app.listen(7777,() => {
  console.log('server is listening on the port 7777...')
})