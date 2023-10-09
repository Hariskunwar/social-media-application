const express=require("express");
const { signup, login, followUnfollowUser, logout, changePassword, myProfile, getUserProfile, updateProfile, deleteAccount, forgotPassword } = require("../controller/userController");
const { isAuthenticated } = require("../middleware/auth");

const router=express.Router();

router.route('/signup').post(signup)

router.route("/login").post(login)

router.route('/logout').get(isAuthenticated,logout)

router.route('/delete-account').delete(isAuthenticated,deleteAccount)
router.route('/change-password').put(isAuthenticated,changePassword)
router.route('/my-profile').get(isAuthenticated,myProfile)
router.route('/follow/:id').get(isAuthenticated,followUnfollowUser)

router.route('/update-profile').patch(isAuthenticated,updateProfile)
router.route("/:id").get(isAuthenticated,getUserProfile)



module.exports=router