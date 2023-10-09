const mongoose=require("mongoose")
const validator=require("validator")
const crypto=require("crypto")
const bcrypt=require("bcrypt")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the name"],
        
    },
    profile:String,
    email:{
        type:String,
        required:[true,"Please enter an email"],
        unique:[true,"Email already exist"],
        validate:[validator.isEmail,"please enter a valid email"]
    },
    
    password:{
        type:String,
        required:[true,"Please enter a password"],
        minlength:[6,"please enter atleast 6 character"],
        select:false
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    followings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
   
},{timestamps:true,runValidators:true})

userSchema.pre('save',async function(next){
  if(!this.isModified("password")){
    return next()
  }
  this.password=await bcrypt.hash(this.password,10)
  next();
})

userSchema.methods.comparePassword=async function(password){
  return await bcrypt.compare(password,this.password)
}



module.exports=mongoose.model("User",userSchema)