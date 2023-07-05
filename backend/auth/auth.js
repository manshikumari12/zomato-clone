const { verify } = require("jsonwebtoken");
const {blackModel} =require("../models/blacklist.model")
const {UserModel}=require("../models/user.model")
require('dotenv').config();

const auth = async (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        const isPresent = await blackModel.findOne({token});
        if(isPresent) return res.status(400).send({msg: 'Login Again'});
        const decoded = verify(token,"zomato");
        if(!decoded) return res.status(400).send({msg: 'Login Again'});
        const user = await UserModel.findOne({_id: decoded.userId});
        req.body.userId = decoded.userId;
        if(user) return next();
        return res.status(500).send({msg: 'Something went wrong'})
    }catch(err){
        console.log('./auth/auth.js :', err.message);
        res.status(500).send({msg: err.message});
    }
}


module.exports = {
    auth
}