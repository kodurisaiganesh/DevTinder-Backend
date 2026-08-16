const express = require("express");
const app = express();
const port = 3000;
const { ConnectDb } = require("./config/database");
const UserData = require("./model/user.js");

app.use(express.json());
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
    res.status(400).send("Something went wrong in update "+err.message);
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
  const user = new UserData(req.body);
  console.log(req.body.firstName);
  try {
    await user.save();
    res.send("Data Saved Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to save data");
  }
});

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
