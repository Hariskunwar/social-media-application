const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel")
exports.isAuthenticated=asyncHandler(async (req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
       return res.status(401).json({
           status:"fail",
           message:"please login first"
       })
    }
    const decoded= jwt.verify(token,process.env.SECRET_KEY)
    const user=await User.findById(decoded.id);
   
    req.user=user;
next();
})