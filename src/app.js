const express = require("express");
const bcyrpt = require("bcrypt");
const app = express();
const port = 3000;
const { ConnectDb } = require("./config/database");
const UserData = require("./model/user.js");
const { validationSignup } = require("./utils/validation.js");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
app.get("/getDetails", async (req, res) => {
  const user = await UserData.findOne({ email: req.body.email });
  res.send(user);
});
app.get("/feed", async (req, res) => {
  const user = await UserData.find({});
  res.send(user);
});

app.patch("/user/:userid", async (req, res) => {
  const userid = req.params?.userid;
  const update = req.body;
  try {
    const ALLOWED_UPDATES = [
      "Skills",
      "Bio",
      "address",
      "password",
      "firstName",
      "lastName",
    ];
    const isupdateAllowed = Object.keys(update).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!isupdateAllowed) {
      throw new Error("Update Not allowed");
    }

    const datas = await UserData.findOneAndUpdate({ email: userid }, update, {
      runValidators: true,
    });
    console.log(datas);
    res.send("Updated Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong in update " + err.message);
  }
});
app.delete("/delete", async (req, res) => {
  const userid = req.body.userid;
  const deletes = req.body;
  try {
    const data = await UserData.findByIdAndDelete(userid, deletes);
    res.send("Delete Success");
  } catch (err) {
    console.log(err);
    res.status(401).send("Something went wrong" + err.message);
  }
});
app.post("/signupp", async (req, res) => {
  const result = await UserData.insertMany([
    {
      firstName: "Sai Ganesh",
      lastName: "Kodurii",
    },
    {
      firstName: "Gundu",
      lastName: "CH",
    },
  ]);
  // await result.save();
  res.send("Updated");
});
app.post("/signup", async (req, res) => {
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
    res.send("Data Saved Successfully");
  } catch (err) {
    res.status(500).send("Failed to save data " + err.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserData.findOne({ email:email });
    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }
    console.log(password);
    console.log(user.password);
    const validatepassword = await bcyrpt.compare(password, user.password);
    console.log(validatepassword);
    if (!validatepassword) {
      return res.status(401).send("Invalid Password");
    }
    const jwttokem = await jwt.sign({ _id: user._id }, "Sai@12345");
    res.cookie("token", jwttokem);
    res.send("Login Success");
  } catch (err) {
    res.status(401).send("Login failed  " + err.message);
  }
});
app.get('/profile',async(req,res)=>{
  try{
  const cookie=req.cookies;
  const {token}=cookie;
  if(!token){
    throw new Error("Invalid Token");
  }
  const decodemessage=await jwt.verify(token,"Sai@12345");
  const {_id}=decodemessage;
  const user=await UserData.findOne({_id});
  if(!user){
    throw new Error("Invalid Id");
  }
  res.send(user);
}
catch(err)
{
  res.status(501).send("Error:  "+err.message);
}


})
ConnectDb()
  .then(() => {
    console.log("Db Connected Succesfully");
    app.listen(port, () => {
      console.log("Port is running");
    });
  })
  .catch(() => {
    console.log("DB Connection Setup Failed");
  });
