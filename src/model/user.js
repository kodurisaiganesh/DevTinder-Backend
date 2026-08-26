const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const bcyrpt = require("bcrypt");

const UserData=new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        minlength:4,
        maxlength:20,
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
        trime:true,
        validate(value){
           if(!validator.isEmail(value))
           {
            throw new Error("Enter a valid email");
           }
        }

    },
    password:{
        type:String,
        minLength:8,
        required:true,
        match: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,

    },
    updatePassword:{
        type:String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong password");
            }
        }

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
    },
    age:{
        type:Number
    },
},{timestamps:true})
UserData.methods.validatePassword=async function(password){
    const user=this;
    const hashedpassword=user.password;
    const validatepassword = await bcyrpt.compare(password, hashedpassword);
    return validatepassword;
}

UserData.methods.getJWT=async function()
{
    const user=this;
     const jwttokem = await jwt.sign({ _id: user._id }, "Sai@12345",{expiresIn:"7d"});
     return jwttokem;
}

module.exports=mongoose.model("UserDatatable",UserData);