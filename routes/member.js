const express = require("express");
const router = express.Router();

const {
  PostData
} = require("../controllers/Data");
const {
  auth,
  isMember,
  isAdmin,
  isSysAdmin,
} = require("../middlewares/authMiddle");

router.post("/data", PostData);

module.exports = router;
