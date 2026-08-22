const express=require('express');
const requestRouter=express.Router();
const {UserAuth}=require('../middlewares/auth')

requestRouter.post('/sentConnectiomRequest',UserAuth,async(req,res)=>{
  const user=req.user;

  try{
    res.send("Sent connection  by  "+user.firstName);
  }
  catch(err){
    throw new Error("Error:  "+err.message);
  }
})

module.exports=requestRouter;