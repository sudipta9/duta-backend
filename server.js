const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./src/router/userRouter");
require("dotenv").config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

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

app.post("/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server started successfully...",
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});
