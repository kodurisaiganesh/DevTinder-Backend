const express = require("express");

const profileRouter = express.Router();
const { UserAuth } = require("../middlewares/auth");
const bcyrpt = require("bcrypt");

const { validationEditProfile } = require("../utils/validation");
profileRouter.get("/profile", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(501).send("Error:  " + err.message);
  }
});

profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    if (!validationEditProfile(req)) {
      throw new Error("Invalid Edit Options");
    }
    const LoginUser = req.user;
    Object.keys(req.body).forEach((k) => (LoginUser[k] = req.body[k]));
    await LoginUser.save();
    res.send(LoginUser);
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});
profileRouter.patch('/profile/password',UserAuth,async(req,res)=>{
  try{
    const{password,updatePassword}=req.body;
    const user=req.user;
    const isPasswordValid=await user.validatePassword(password);
    if(!isPasswordValid){
      throw new Error("Wrong Password");
    }
    const hashedPassword=await bcyrpt.hash(updatePassword,10);
    user.password=hashedPassword;
    await user.save();
    res.send("Password Updated Successfully");
  }
  catch(err){
    res.status(401).send("Error: "+err.message);
  }

})
module.exports = profileRouter;
