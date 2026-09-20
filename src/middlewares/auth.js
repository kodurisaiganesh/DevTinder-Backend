const cookiparser=require('cookie-parser');
const jwt =require('jsonwebtoken')
const UserData=require('../model/user')
const UserAuth= async function (req,res,next){
    try{
    const {token}=req.cookies;
    if(!token)
    {
        return res.status(401).send("Please Login");
    }
    const decodemessage=await jwt.verify(token,"Sai@12345");
    const {_id}=decodemessage
    const user=await UserData.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    const lastActiveAt = new Date();
    await UserData.updateOne({_id:user._id},{$set:{lastActiveAt,isOnline:true,lastSeenAt:null}});
    user.lastActiveAt = lastActiveAt;
    user.isOnline = true;
    req.user=user;
    next();
   }
    catch(err){
        res.status(400).send("Error:  "+err.message);
    }

}
module.exports={UserAuth}