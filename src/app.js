const express = require("express");
const app = express();
const port = 3000;
const { ConnectDb } = require("./config/database");
const UserData = require("./model/user.js");
const { validationSignup } = require("./utils/validation.js");
const {UserAuth}=require('./middlewares/auth.js')
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const authRouter=require('./routes/auth.js');
const profileRouter=require('./routes/profile.js');
const requestRouter=require('./routes/request.js');
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);


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
