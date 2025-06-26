const mongoose=require('mongoose')

const connectDb=async() => {
  await mongoose.connect('mongodb+srv://charan11w:18M8d2KWm7mNYYrP@devtinder.jyqjoqg.mongodb.net/devTinder')
}

module.exports=connectDb;