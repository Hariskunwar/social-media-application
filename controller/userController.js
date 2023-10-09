const User=require("../models/userModel");
const asyncHandler=require("express-async-handler")
const Post=require("../models/postModel")
const jwt=require("jsonwebtoken")


const signToken=(id)=>{
    return jwt.sign({id},process.env.SECRET_KEY)
}

//register user
exports.signup=asyncHandler(async (req,res)=>{
  
   
        const {email}=req.body;
    const user=await User.findOne({email});
    if(user){
        return res.status(400).json({
            status:"fail",
            message:"user already exist"
        })
    }

    const newUser=await User.create(req.body)
    const token=signToken(newUser._id)
    res.status(201).cookie("token",token,{
        expires:new Date(Date.now()+30*24*60*60*1000),
        httpOnly:true
    }).json({
        status:"success",
        token,
        data:{
            newUser
        }
    })
    
    
})

    
    //login user
    exports.login=asyncHandler(async (req,res)=>{
            
            const {email,password}=req.body;
            const user=await User.findOne({email}).select("+password");
            if(!user){
                return  res.status(400).json({
                    status:"fail",
                    message:"user does not exist"
                })
            }
            if(user && !(await user.comparePassword(password))){
               return res.status(400).json({
                    status:"fail",
                    message:"Incorrect password"
                })
            } 
            const token=signToken(user._id)
        res.status(200).cookie("token",token,{
            expires:new Date(Date.now()+30*24*60*60*1000),
            httpOnly:true
        }).json({
            status:"success",
            token
        })
       
    })

    //follow and unfollow user
    exports.followUnfollowUser=asyncHandler(async (req,res)=>{
        const userToFollow=await User.findById(req.params.id);
        const loggedUser=await User.findById(req.params.id)
        if(!userToFollow){
            return res.status(404).json({
                  status:"fail",
                  message:"User not found"
            })
        }
        if(loggedUser.followings.includes(req.params.id)){
            await User.findByIdAndUpdate(req.user._id,{$pull:{followings:req.params.id}})
            await User.findByIdAndUpdate(req.params.id,{$pull:{followers:req.params.id}})
            res.status(200).json({
                status:"success",
                message:"user unfollowed"
            })
        }else{
             await User.findByIdAndUpdate(req.user._id,{$push:{followings:req.params.id}})
            await User.findByIdAndUpdate(req.params.id,{$push:{followers:req.params.id}})
            res.status(200).json({
                status:"success",
                message:"user followed"
            })
        }
    })


   // logout functionality
   exports.logout=asyncHandler(async (req,res)=>{
    res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true}).json({
        status:"success",
        message:"logged out"
    })
   })

   //change password

   exports.changePassword=asyncHandler(async (req,res)=>{
    const user=await User.findById(req.user._id).select("+password")
    const {oldPassword,newPassword}=req.body;
    if(!oldPassword || !newPassword){
        return res.status(400).json({
            status:"fail",
            message:"please enter old password and new password"
        })
    }
    if(!(await user.comparePassword(oldPassword))){
        return res.status(400).json({
             status:"fail",
             message:"old password does not match"
         })
     } 
     user.password=newPassword;
     await user.save();
      res.status(200).json({
        status:"success",
        message:"password changed"
    })
   })

   

   //see own profile
   exports.myProfile=asyncHandler(async (req,res)=>{
    const profile= await User.findById(req.user._id).populate('posts')
    res.status(200).json({
        status:"success",
        profile
    })
   })

   //get other user profile

   exports.getUserProfile=asyncHandler(async (req,res)=>{
    const user=await User.findById(req.params.id).populate("posts")
    if(!user){
        return res.status(404).json({
            status:"fail",
            message:"user not found"
        })
    }
    res.status(200).json({
        status:"success",
        user
    })
   })

   //update own profile
   exports.updateProfile=asyncHandler(async (req,res)=>{
    let user=await User.findById(req.user._id)
    const {name,email}=req.body;
    if(name){
        user.name=name
    }
    if(email){
        user.email=email
    }
    await user.save();
    res.status(200).json({
        status:"success",
        message:"profile updated"
    })
   })

   //delete own account
   exports.deleteAccount=asyncHandler(async (req,res)=>{
    const userId=req.user._id;
    //use Promise.all for concurrent deletion operations
    await Promise.all([
        //delete user posts
        Post.deleteMany({ postedBy: userId }),
  
        //remove user id from other users followings
        User.updateMany({ followings: userId }, { $pull: { followings: userId } }),
  
        //remove user id from other users followers list
        User.updateMany({ followers: userId }, { $pull: { followers: userId } }),
  
        //remove user id from post likes
        Post.updateMany({ likes: userId }, { $pull: { likes: userId } }),
  
        // remove user id from post comments
        Post.updateMany({}, { $pull: { comments: { user: userId } } }),
  
        // delete the user
        User.findByIdAndDelete(userId),
      ]);
  
     
      res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({
        status: "success",
        message: "Your account has been deleted",
      });


   })