const express = require("express");
const router = express.Router();

const {
  getAllMembers,
  getSingleMember,
  createMember,
  updateMember,
  deleteMember,
} = require("../controllers/MemberController");
const {
  auth,
  isMember,
  isAdmin,
  isSysAdmin,
} = require("../middlewares/authMiddle");

router.get("/members", getAllMembers);
router.get("/members/:id", auth, getSingleMember);
router.post("/members", auth, createMember);
router.put("/members/:id", auth, updateMember);
router.delete("/members/:id", auth, deleteMember);

module.exports = router;
