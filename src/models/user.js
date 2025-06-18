const mongoose=require('mongiise')
const{Schema,model}=mongoose

const userSchema=new Schema({
  firstName:{
    typeof:String
  },
  lastdName:{
    typeof:String
  },
  emailId:{
    typeof:String
  },
  password:{
    typeof:String
  },
  age:{
    typeof:String
  },
  gender:{
    typeof:String
  }
})

module.exports=model("User",userSchema);