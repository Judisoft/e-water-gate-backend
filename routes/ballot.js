const express = require("express");
const router = express.Router();

const {
  getUserBallotStatus,
  createBallot,
  getRanks,
  checkRank,
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
router.post("/ballots/check-rank", auth, checkRank);

module.exports = router;
