const express = require("express");
const mongoose = require("mongoose");
const { chatRouter } = require("./src/router/chatRouter");
const userRouter = require("./src/router/userRouter");
require("dotenv").config({ path: "./.env" });
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

mongoose
  .connect("mongodb://10.0.0.10/duta", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

app.get("/api/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server started successfully...",
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});
