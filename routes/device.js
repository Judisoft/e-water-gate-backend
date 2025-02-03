const express = require("express");
const router = express.Router();

//Handlers from controllers
const {
  auth,
  isMember,
  isAdmin,
  isSysAdmin,
} = require("../middlewares/authMiddle");
const { createDevice, getAllDevices } = require("../controllers/DeviceController");

router.post("/devices", createDevice);
router.get("/devices",  getAllDevices);

module.exports = router;
