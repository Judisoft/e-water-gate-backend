const express = require("express");
const router = express.Router();

const {
  StreamData,
  StoreData
} = require("../controllers/Data");
const {
  auth,
  isMember,
  isAdmin,
  isSysAdmin,
} = require("../middlewares/authMiddle");

router.post("/data/stream", StreamData);
router.post("/data/store", StoreData)



module.exports = router;
