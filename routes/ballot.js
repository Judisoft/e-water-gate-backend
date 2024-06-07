const express = require("express");
const router = express.Router();

const {
  getUserBallotStatus,
  createBallot,
  getRanks,
  getAllBallots,
  activateBallot,
} = require("../controllers/BallotController");
const {
  auth,
  isMember,
  isAdmin,
  isSysAdmin,
} = require("../middlewares/authMiddle");

router.get("/ballots/all", auth, getAllBallots);
router.post("/ballots", auth, createBallot);
router.post("/ballots/ranks", auth, getRanks);

module.exports = router;
