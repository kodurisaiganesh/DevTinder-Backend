const express=require('express');
const requestRouter=express.Router();

const UserData = require("../model/user.js");

const {UserAuth}=require('../middlewares/auth')
const ConnectRequestModel=require('../model/connectionRequest');
requestRouter.post('/sent/request/:status/:toUserId',UserAuth,async(req,res)=>{

   try{
  const fromUserId=req.user._id;
  const toUserId=req.params.toUserId;
  const status=req.params.status;

    if(fromUserId.toString()===toUserId){
        return res.status(401).send("Cannot send Request yourself");
    }
    const toUserFound =await UserData.findById(toUserId);
    if(!toUserFound){
      return res.status(401).send("User cannot found");
    }
    const statusAllowd=["ignored","interested"];
    if(!statusAllowd.includes(status)){
      return res.status(400).send("Status is not Allowed");
    }

    const existingConnectionRequest=await  ConnectRequestModel.findOne({
      $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
      ]
    })
    if(existingConnectionRequest){
      return res.status(400).send({message:"Connection Request Already Exists"});
    }

    const RequestModel =new ConnectRequestModel({
      fromUserId,
      toUserId,
      status
    })
    await RequestModel.save();

    res.send(req.user.firstName+"  "+status+" "+toUserFound.firstName);
  }
  catch(err){
    res.status(400).send("Error:  "+err.message);
  }
})

module.exports=requestRouter;