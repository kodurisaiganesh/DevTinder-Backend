const express = require("express");
const app = express();
const port = 3000;

const { ConnectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],

  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

ConnectDb()
  .then(() => {
    console.log("Db Connected Successfully");

    app.listen(port, () => {
      console.log("Port is running");
    });
  })
  .catch(() => {
    console.log("DB Connection Setup Failed");
  });