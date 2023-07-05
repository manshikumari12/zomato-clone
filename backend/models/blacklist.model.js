const mongoose = require('mongoose')
const blackschema = mongoose.Schema({
    token:{
        type:String,
        unique:true,
        required:true 
    }
})

const blackModel= mongoose.model("black",blackschema)

module.exports={
    blackModel
}