const mongoose=require('mongoose')
const{Schema,model}=mongoose

const userSchema=new Schema({
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  emailId:{
    type:String
  },
  password:{
    type:String
  },
  age:{
    type:String
  },
  gender:{
    type:String
  }
})

module.exports=model("User",userSchema);