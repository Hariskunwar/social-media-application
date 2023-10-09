require("dotenv").config({path:"config/config.env"})
const  {dbConnect}=require("./config/dbConnect")
const app=require('./app')

dbConnect();


const port=process.env.PORT || 9000
app.listen(port,()=>{
    console.log(`server started at port : ${port} `);
})