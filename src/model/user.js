const mongoose=require('mongoose')

const UserData=new mongoose.Schema({

    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    phone:{
        type:Number
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    gender:{
        type:String
    },
    address:{
        type:String
    }
})

module.exports=mongoose.model("UserDatatable",UserData);