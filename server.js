const express= require ("express")
const userRouter=require ('./router/userRouter.js')
const adminRouter=require ('./router/adminRouter.js')
const app= express()
app.use(express.json());
const mongoose=require("mongoose")
const connectDB=require("./connection/db.js")
const dotenv=require('dotenv').config()
const port=process.env.PORT
connectDB()
app.use("/api/user",userRouter)
app.use("/api/admin",adminRouter)

app.listen(port,()=>{
    console.log(`server is running in ${port}`);
})