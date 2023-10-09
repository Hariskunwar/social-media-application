 const Post=require("../models/postModel")
const asyncHandler=require("express-async-handler")
const User=require("../models/userModel")


//create post
exports.createPost=asyncHandler(async (req,res)=>{
    req.body.postedBy=req.user._id;
    const post=await  Post.create(req.body)
    await User.findByIdAndUpdate(req.user._id,{$push:{posts:post._id}})
    res.status(201).json({
        status:"success",
        data:{
            post
        }
    })
})


// post like functionality
exports.likePost=asyncHandler(async (req,res)=>{
    const post=await Post.findById(req.params.id)
    if(!post){
        return res.status(404).json({
            status:"fail",
            message:"post not found"
        })
    }
    if(post.likes.includes(req.user.id)){
        await Post.findByIdAndUpdate(post._id,{$pull:{likes:req.user._id}})
        return res.status(200).json({
            status:"success",
            message:"post like removed"
        })
    }else{
        await Post.findByIdAndUpdate(post._id,{$push:{likes:req.user._id}})
        return res.status(200).json({
            status:"success",
            message:"post liked"
        })
    }
})

//delete a post
exports.deletePost=asyncHandler(async (req,res,next)=>{
    const post=await Post.findById(req.params.id)
    if(!post){
        return res.status(404).json({
            status:"fail",
            message:"post not found"
        })
    }
    if(post.postedBy.toString()!==req.user._id.toString()){
        res.status(401).json({
            status:"success",
            message:"unauthorized"
        })
    }
    await Post.findByIdAndDelete(req.params.id)

    await User.findByIdAndUpdate(req.user._id,{$pull:{posts:req.params.id}})

    res.status(200).json({
        status:"success",
        message:"post deleted"
    })
})

//get all the post of which we followed

exports.getPostOfFollowing=asyncHandler(async (req,res)=>{
    const user=await User.findById(req.user._id)
    const posts=await Post.find({postedBy:{$in:user.followings}})
    res.status(200).json({
        status:"success",
        posts
    })
})

//comment on post

exports.addComment=asyncHandler(async (req,res)=>{
    const post=await Post.findById(req.params.id)
    if(!post){
        return res.status(404).json({
            status:"success",
            message:"post not found"
        })
    }
    await Post.findByIdAndUpdate(post._id,{$push:{comments:{user:req.user._id,comment:req.body.comment}}})
    res.status(200).json({
        status:"fail",
        message:"comment added"
    })
})

//delete comment

exports.deleteComment = asyncHandler(async (req, res) => {
   
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({
          status: "fail",
          message: "Post not found",
        });
      }
  
      // find the comment index in the comments array
      const commentIndex = post.comments.findIndex(
        (comment) => comment._id.toString() === req.body.commentId
      );
  
      // check if the comment exists
      if (commentIndex === -1) {
        return res.status(404).json({
          status: "fail",
          message: "Comment not found",
        });
      }
  
      //check if the user is the post owner or the comment owner
      if (
        post.postedBy.toString() === req.user._id.toString() ||
        post.comments[commentIndex].user.toString() === req.user._id.toString()
      ) {
        
        await Post.findByIdAndUpdate(post._id, {
          $pull: { comments: { _id: req.body.commentId } },
        });
  
        return res.status(200).json({
          status: "success",
          message: "Comment deleted",
        });
      } else {
        return res.status(401).json({
          status: "fail",
          message: "You are not authorized to delete this comment",
        });
    }
    })