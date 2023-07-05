const express = require("express")
require("dotenv").config()
const passport=require("passport")
const {connection }= require("./db")
const {userrouter} = require("./route/user.route")
// const http = require("http").createServer(app)
const cors = require("cors")
const app= express()
app.use(express.json())
app.use(cors())
const { googleAuthentication } = require("./google.oauth")

app.get("/",(req,res)=>{
    console.log("welcome to the page")

})

app.use("/",userrouter)


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session:false }), googleAuthentication )


app.listen(process.env.port, async()=>{
    try {
        await connection;
        console.log("connected to data-base")
        
    } catch (error) {
        console.log(error)
    }
    console.log(`server is running at port ${process.env.port}`)

})

