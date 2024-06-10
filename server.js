const express= require ("express")
const userRouter=require ('./router/userRouter.js')

const app= express()
const dotenv=require('dotenv').config()
const port=process.env.PORT

app.use("/",userRouter)

app.listen(port,()=>{
    console.log(`server is running in ${port}`);
})