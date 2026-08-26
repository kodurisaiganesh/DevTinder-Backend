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

requestRouter.post('/request/view/:status/:requestId',UserAuth,async(req,res)=>{

  try{
    const loginedUser=req.user._id;
    const status=req.params.status;
    const requestId=req.params.requestId;
    const allowedStatus=["accepted","rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).send("Invalid Status");
    }

    const connectionRequest=await ConnectRequestModel.findOne({
      _id:requestId,
      toUserId:loginedUser,
      status:"interested"
    });
    if(!connectionRequest){
      return res.status(404).json({message:"Connection Request not found"});
    }

    connectionRequest.status=status;
    const data=await connectionRequest.save();
    return res.json({
      message:"Connection Request is "+status,data});
}
catch(err){
  return res.status(400).send("Error: "+err.message);
}



})




module.exports=requestRouter;