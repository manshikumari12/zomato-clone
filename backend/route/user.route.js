const express = require("express")
const jwt = require("jsonwebtoken")
const {auth}= require("../auth/auth")
const { hash,compare } = require("bcrypt");
const nodemailer = require('nodemailer');
const {blackModel} =require("../models/blacklist.model")
const {UserModel}= require("../models/user.model")
require("dotenv").config()

const userrouter= express.Router()

// userrouter.use(auth);


const transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"guptamanshi606@gmail.com",
        pass:"pecdubvwywqpctqk",
    },
    port:1111,
    secure:false
})

userrouter.post("/login",async(req,res)=>{
    try{
        const {email, password} = req.body;
        const isUserValid = await UserModel.findOne({email});
        if(!isUserValid) return res.status(404).send({msg: "Wrong Credentials"});
        const result = await compare(password, isUserValid.password);
        if(result){
            console.log(result)
            if(!isUserValid.isVerified){
                console.log(!isUserValid.isVerified)
                return res.status(404).send({msg: 'Your email is not verified'});
            }
            const access_token = jwt.sign({userId: isUserValid._id}, process.env.secret, {expiresIn: '4h'});
            return res.status(200).send({msg: 'Receiving from frontend', access_token, 'user': isUserValid.name, 'userId': isUserValid._id });
        }
        return res.status(404).send({msg: 'Wrong Credentials'});
    }catch(err){
        console.log("/login: ", err.message);
        res.status(500).send({msg: err.message});
    }
})
const verifying = (id, email)=>{
    transporter.sendMail({
        to:email,
        from:"guptamanshi606@gmail.com",
        subject:"email verification",
        html:`<p> Hello, Please click on verify to get your email verified.<a href=http://localhost:1111/verify/${id}>verify</a></p>`
    },(err)=>{
        if(err){
            console.log("didn't send the email",err);  
        }else{
            console.log('Email sent');
        }
    })
}

userrouter.get('/:id',async (req, res)=>{
    try {
        let {id}=req.params
        console.log(id)
        let user = await UserModel.findById(id)
        console.log(user)
        res.status(200).send({'name': user.name});
        
    } catch (err) {
        res.status(500).send({msg: err.message});
    }
} )

userrouter.post("/signup",async(req,res)=>{
    try {
        let {name,email,password}=req.body;
        let userExist = await UserModel.findOne({email});
        if(userExist) return res.status(400).send({msg:"user already exixts"})
        password=await hash(password,6)
        const newuser =new UserModel({name,email,password})
        verifying(newuser._id,email)
        await newuser.save()
        res.status(200).send({msg: 'User Created'});
        
    } catch (err) {
        console.log('/signup: ', err.message);
        res.status(500).send({msg: err.message});  
    }
})




userrouter.get('/verify/:id', async(req,res)=>{
    try {
        let {id} =req.params
        await UserModel.findByIdAndUpdate(id, {isVerified: true})
        res.send('<h2>email verified</h2>')
        
    } catch (err) {
        res.status(500).send({msg: err.message});
    }
})



userrouter.post("/logout",auth,async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.auth;
        const blacklisted = new blackModel({"token": token});
        await blacklisted.save();
        console.log('logout successful')
        res.status(200).send({msg: 'Logout Successful'});
    }catch(err){
        console.log('/logout: ', err.message);
        console.log(err);
        res.status(500).send({msg: err.message});
    }
})



module.exports={userrouter}