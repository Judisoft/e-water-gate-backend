const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
const { getAuth } = require("firebase/auth");

const app = express();
app.use(cors());
// parse request of content-type - application/json
app.use(express.json());

// parse request of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();
const port = process.env.PORT || 4000;

// Route importing and mounting
const user = require("./routes/user");
const data = require("./routes/data");
const device = require("./routes/device");

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.use("/api/v1", user);
app.use("/api/v1", data);
app.use("/api/v1", device)


async function start() {
  try {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyBOOsKN2TCl1nZMs9bMC0Y7rsfXwtTy0TQ",
      authDomain: "e-wategate.firebaseapp.com",
      databaseURL: "https://e-wategate-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "e-wategate",
      storageBucket: "e-wategate.firebasestorage.app",
      messagingSenderId: "866686347436",
      appId: "1:866686347436:web:7b019d20d8f4b9a1d7d709",
      measurementId: "G-Q7E002TKV1",
    };

    // Initialize Firebase
    const firebaseApp = initializeApp(firebaseConfig);

    // Initialize Firebase services
    const database = getDatabase(firebaseApp);
    const auth = getAuth(firebaseApp);

    console.log("Firebase initialized");

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

start();

module.exports = app;
