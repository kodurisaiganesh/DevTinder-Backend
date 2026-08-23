const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcyrpt = require("bcrypt");
const UserData = require("../model/user.js");
const { validationSignup } = require("../utils/validation.js");

authRouter.post("/signup", async (req, res) => {
  //console.log(req.body.firstName);

  try {
    const { firstName, lastName, email, password, phone } = req.body;
    console.log(firstName);
    const hashpassword = await bcyrpt.hash(password, 10);
    console.log(hashpassword);
    validationSignup(req);
    const user = new UserData({
      firstName,
      lastName,
      email,
      password: hashpassword,
      phone,
    });
    await user.save();
    res.send("Signup Successfully");
  } catch (err) {
    res.status(500).send("Failed to save data " + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserData.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }
    console.log(password);
    console.log(user.password);
    const validatepassword = await user.validatePassword(password);
    console.log(validatepassword);
    if (!validatepassword) {
      return res.status(401).send("Invalid Password");
    }
    const jwttokem = await user.getJWT();
    res.cookie("token", jwttokem, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.send("Login Success");
  } catch (err) {
    res.status(401).send("Login failed  " + err.message);
  }
});

authRouter.post('/logout',async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())
    })
    res.send("Logout Success");

})

module.exports = authRouter;
