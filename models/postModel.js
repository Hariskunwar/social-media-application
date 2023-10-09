const mongoose=require("mongoose")

const postSchema=new mongoose.Schema({
    caption:String,
    images:String,
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        comment:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})

module.exports=mongoose.model('Post',postSchema)