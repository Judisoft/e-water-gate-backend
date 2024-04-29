const express = require("express");
const router = express.Router();

const {
  getAllGroups,
  getSingleGroup,
  createGroup,
  updateGroup,
  deleteGroup,
} = require("../controllers/GroupController");
const {
  auth,
  isMember,
  isAdmin,
  isSysAdmin,
} = require("../middlewares/authMiddle");

router.get("/groups", auth, getAllGroups);
router.get("/groups/:id", auth, getSingleGroup);
router.post("/groups", auth, createGroup);
router.put("/groups/:id", auth, updateGroup);
router.delete("/groups/:id", auth, deleteGroup);

module.exports = router;
