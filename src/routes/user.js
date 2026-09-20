const express=require('express');
const userRouter=express.Router();
const {UserAuth}=require('../middlewares/auth')
const ConnectRequestModel=require('../model/connectionRequest');
const UserModel=require('../model/user.js')
const MessageModel=require('../model/message.js')

const findAcceptedConnection = (userId, otherUserId) => ConnectRequestModel.findOne({
    $or: [
        {fromUserId:userId, toUserId:otherUserId, status:"accepted"},
        {fromUserId:otherUserId, toUserId:userId, status:"accepted"}
    ]
});

const getChatUser = async (userId, otherUserId) => {
    if (userId.toString() === otherUserId.toString()) return null;
    const connection = await findAcceptedConnection(userId, otherUserId);
    if (!connection) return null;
    return UserModel.findById(otherUserId).select("firstName lastName photoUrl lastActiveAt lastSeenAt updatedAt isOnline");
};

userRouter.get('/user/request/received',UserAuth,async(req,res)=>{
    try{
    const loginedUser=req.user._id;
        const RequestModel=await ConnectRequestModel.find({
            toUserId:loginedUser,
            status:"interested"
        }).populate("fromUserId", [
  "firstName",
  "lastName",
  "Skills",
  "Bio",
  "age",
  "gender",
  "photoUrl"
])
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

                }).populate("fromUserId",["firstName","lastName","Skills","Bio","age","photoUrl"])
                    .populate("toUserId",["firstName","lastName","Skills","Bio","age","photoUrl"])

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

userRouter.get('/user/profile/:userId',UserAuth,async(req,res)=>{
    try{
        const profile=await UserModel.findById(req.params.userId)
            .select("firstName lastName age gender address Skills Bio photoUrl createdAt");
        if(!profile){
            return res.status(404).json({message:"Profile not found"});
        }
        const isConnection = await findAcceptedConnection(req.user._id, req.params.userId);
        res.json({
            ...profile.toObject(),
            isConnection: Boolean(isConnection)
        });
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

userRouter.get('/user/search',UserAuth,async(req,res)=>{
    try{
        const search = typeof req.query.search === "string"
            ? req.query.search.trim().slice(0, 50)
            : "";
        const limit=Math.min(Math.max(parseInt(req.query.limit,10)||20,1),50);
        if(!search){
            return res.json([]);
        }

        const searchTokens = search.split(/\s+/).filter(Boolean);
        const users=await UserModel.find({
            _id:{$ne:req.user._id},
            $and:searchTokens.map((token)=>{
                const searchPattern = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
                return {$or:[{firstName:searchPattern},{lastName:searchPattern},{Skills:searchPattern}]};
            })
        }).select("firstName lastName age gender Skills Bio photoUrl").limit(limit);

        res.json(users);
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

userRouter.get('/feed',UserAuth,async(req,res)=>{
    try{
        const search = typeof req.query.search === "string"
            ? req.query.search.trim().slice(0, 50)
            : "";
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
        const feedFilter = {
            $and: [
                {_id:{$nin:Array.from(hideUsers)}},
                {_id:{$ne:loginedUser._id}}
            ]
        };

        if (search) {
            const searchPattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            feedFilter.$and.push({
                $or: [
                    {firstName: searchPattern},
                    {lastName: searchPattern},
                    {Skills: searchPattern}
                ]
            });
        }

        const users=await UserModel.find(feedFilter)
                    .select("firstName lastName age gender Skills Bio photoUrl")
                    .skip(skip)
                    .limit(limit)

        res.send(users);

    }
    catch(err){
        res.status(401).send("Error: "+err.message);
    }
})

userRouter.get('/messages/:userId',UserAuth,async(req,res)=>{
    try{
        const chatUser=await getChatUser(req.user._id, req.params.userId);
        if(!chatUser){
            return res.status(403).json({message:"Messages are available for connections only"});
        }

        await MessageModel.updateMany({
            senderId:chatUser._id,
            receiverId:req.user._id,
            readAt:null
        },{$set:{readAt:new Date()}});

        const messages=await MessageModel.find({
            $or:[
                {senderId:req.user._id, receiverId:chatUser._id},
                {senderId:chatUser._id, receiverId:req.user._id}
            ]
        }).sort({createdAt:1}).limit(200);

        res.json({user:chatUser, messages});
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

userRouter.get('/messages',UserAuth,async(req,res)=>{
    try{
        const userId=req.user._id;
        const connectionRequests=await ConnectRequestModel.find({
            $or:[
                {fromUserId:userId,status:"accepted"},
                {toUserId:userId,status:"accepted"}
            ]
        });

        const conversations=await Promise.all(connectionRequests.map(async(connection)=>{
            const otherUserId=connection.fromUserId.toString() === userId.toString()
                ? connection.toUserId
                : connection.fromUserId;
            const person=await UserModel.findById(otherUserId)
                .select("firstName lastName photoUrl lastActiveAt lastSeenAt updatedAt isOnline");
            const lastMessage=await MessageModel.findOne({
                $or:[
                    {senderId:userId,receiverId:otherUserId},
                    {senderId:otherUserId,receiverId:userId}
                ]
            }).sort({createdAt:-1});
            const unreadCount=await MessageModel.countDocuments({
                senderId:otherUserId,
                receiverId:userId,
                readAt:null
            });

            return person ? {person,lastMessage,unreadCount} : null;
        }));

        conversations.sort((first,second)=>
            new Date(second?.lastMessage?.createdAt || 0) -
            new Date(first?.lastMessage?.createdAt || 0)
        );
        res.json({conversations:conversations.filter(Boolean)});
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

userRouter.post('/messages/:userId',UserAuth,async(req,res)=>{
    try{
        const text=typeof req.body.text === "string" ? req.body.text.trim() : "";
        if(!text || text.length > 2000){
            return res.status(400).json({message:"Message must be between 1 and 2000 characters"});
        }

        const chatUser=await getChatUser(req.user._id, req.params.userId);
        if(!chatUser){
            return res.status(403).json({message:"Messages are available for connections only"});
        }

        const message=await MessageModel.create({
            senderId:req.user._id,
            receiverId:chatUser._id,
            text
        });
        res.status(201).json(message);
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

module.exports=userRouter;