const mongoose = require("mongoose")

const userschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
     
email:{
    type:String,
    require:true,
    unique:true
},
 password:{
    type:String,
    required:true
 },
 isVerified: {
    type: Boolean,
    default: false
}

})

const UserModel=mongoose.model("user",userschema)

module.exports={UserModel}