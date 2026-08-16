const mongoose=require('mongoose')

const UserData=new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        minlength:4,
        maxlength:10,
        trim:true
    },
    lastName:{
        type:String,
        minLength:4,
        maxLength:40,
        trim:true
    },
    phone:{
        type:Number,
        minLength:10,
        maxLength:10,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trime:true

    },
    password:{
        type:String,
        minLength:8,
        required:true,
        match: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,

    },
    gender:{
        type:String,
        enum: {
        values: ["male", "female", "others"],
        message: "Invalid gender type"
    }
    },
    address:{
        type:String
    },
    Skills:{
        type:[String]
    },
    Bio:{
        type:String,
        default:"Welcome to the dev tinderr"
    }
},{timestamps:true})

module.exports=mongoose.model("UserDatatable",UserData);