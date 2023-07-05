const jwt = require("jsonwebtoken")
// const socketIO = require("socket.io")
const {userModel} =require("../models/user.model")
const {chatModel} =require("../models/chat.model")
require("dotenv").config()


const io= require("socket.io")(http)


io.on('connection',(socket)=>{
    console.log("connecte...")
})