const express=require("express");
const { isAuthenticated } = require("../middleware/auth");
const { createPost, likePost, deletePost, getPostOfFollowing, addComment, deleteComment } = require("../controller/postController");

const router=express.Router();

router.route('/').post(isAuthenticated,createPost)

router.route('/like/:id').put(isAuthenticated,likePost);

router.route('/comment/:id').put(isAuthenticated,addComment)

router.route('/delete-comment/:id').put(isAuthenticated,deleteComment)
router.route('/get-posts').get(isAuthenticated,getPostOfFollowing)


                       
router.route('/:id').delete(isAuthenticated,deletePost)


module.exports=router