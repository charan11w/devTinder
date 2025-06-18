const adminAuth=(req,res,next)=>{
  console.log("admin is beign authorized")
  const token='xyz';
  const isAdminAuthorized=token==='xyz'

  if(!isAdminAuthorized) res.status(401).send("admin is not authorized") 
  else next()
}

const userAuth=(req,res,next)=>{
  console.log("admin is beign authorized")
  const token='xyz';
  const isUserAuthorized=token==='xyz'

  if(!isUserAuthorized) res.status(401).send("User is not authorized") 
  else next()
}

module.exports={
  adminAuth,
  userAuth
}