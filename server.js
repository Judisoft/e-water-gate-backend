const express = require("express");
const otpController = require("./controllers/otpController");
const cors = require("cors");

const app = express();
app.use(cors());
// parse request of content-type - application/json
app.use(express.json());

// parse request of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();
const port = process.env.PORT || 4000;

app.use(express.json());

//route importing and mounting
const user = require("./routes/user");
const data = require("./routes/data");

app.use("/api/v1", user);
app.post("/api/v1/send-otp", otpController.sendOTP);
app.use("/api/v1", data);

async function start() {
  try {
    //calling Database function
    // require("./config/database").connect();

    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();

module.exports = app;
