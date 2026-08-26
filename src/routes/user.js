const express=require('express');
const userRouter=express.Router();
const {UserAuth}=require('../middlewares/auth')
const ConnectRequestModel=require('../model/connectionRequest');
const UserModel=require('../model/user.js')

userRouter.get('/user/request/received',UserAuth,async(req,res)=>{
    try{
    const loginedUser=req.user._id;
        const RequestModel=await ConnectRequestModel.find({
            toUserId:loginedUser,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName"])
        res.json({message:"Data Fetched Successfully",
            data:RequestModel
        })
    }
    catch(err){
        res.status(401).send("Error: "+err.message);
    }

})

userRouter.get('/user/connections',UserAuth,async(req,res)=>{
    try{
    const loginedUser=req.user.id;
    const RequestModel=await ConnectRequestModel.find({
        $or:[
           { toUserId:loginedUser,status:"accepted"},
            { fromUserId:loginedUser,status:"accepted"}

        ]

        }).populate("fromUserId",["firstName","lastName"])
          .populate("toUserId",["firstName","lastName"])

    const data=RequestModel.map((row)=>{
        if(row.fromUserId._id.toString()===loginedUser.toString())
        {
            return row.toUserId;
        }
        else{
            return row.fromUserId;
        }
    })
    res.json({data})
}
catch(err){
    res.status(401).send("Error: "+err.message);
}
})

userRouter.get('/feed',UserAuth,async(req,res)=>{
    try{
        const skip=Math.max(parseInt(req.query.skip,10)||0,0);
        const limit=Math.min(Math.max(parseInt(req.query.limit,10)||10,1),50);
        const loginedUser=req.user;
        const connectionRequest=await ConnectRequestModel.find({
            $or:[
                {toUserId:loginedUser._id},
                {fromUserId:loginedUser._id}
            ]
        }).select("fromUserId toUserId")
        const hideUsers=new Set();
        connectionRequest.forEach((req)=>{
            hideUsers.add(req.toUserId.toString());
            hideUsers.add(req.fromUserId.toString());
        })
        const users=await UserModel.find({
            $and:[
                {_id:{$nin:Array.from(hideUsers)}},
                {_id:{$ne:loginedUser._id}}
            ]
                }).select("firstName lastName")
                    .skip(skip)
                    .limit(limit)

        res.send(users);

    }
    catch(err){
        res.status(401).send("Error: "+err.message);
    }
})

module.exports=userRouter;