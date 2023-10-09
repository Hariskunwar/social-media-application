const express=require('express')
const userRouter=require("./routes/userRoute")
const postRouter=require("./routes/postRoute")
const cookieParser=require("cookie-parser")
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(cookieParser())

app.use('/api/v1/users',userRouter)

app.use('/api/v1/posts',postRouter)

app.all('*',(req,res,next)=>{
    const error=new Error(`route not found ${req.originalUrl}`)
    res.status(404)
    next(error)
})

app.use((error,req,res,next)=>{
    const statusCode=res.statusCode?res.statusCode:500;
    res.status(statusCode);
    res.json({
        msg:error.message,
        stack:error.stack
    })
})



module.exports=app