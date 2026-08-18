const cookiparser=require('cookie-parser');
const jwt =require('jsonwebtoken')
const UserData=require('../model/user')
const UserAuth= async function (req,res,next){
    try{
    const {token}=req.cookies;
    if(!token)
    {
        throw new Error("Invalid Error");
    }
    const decodemessage=await jwt.verify(token,"Sai@12345");
    const {_id}=decodemessage
    const user=await UserData.find({_id});
    if(!user){
        throw new Error("User not found");
    }
    req.user=user;
    next();
   }
    catch(err){
        res.status(400).send("Error:  "+err.message);
    }

}
module.exports={UserAuth}