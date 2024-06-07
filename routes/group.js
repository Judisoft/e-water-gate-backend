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
// router.get("/groups/:id", auth, getSingleGroup);  //get by id
router.get("/groups/:group", auth, getSingleGroup); // get by group title
router.post("/groups", auth, createGroup);
// router.put("/groups/:id", auth, updateGroup); //update by id
router.put("/groups/:group", auth, updateGroup); //update by group title
router.delete("/groups/:id", auth, deleteGroup);

module.exports = router;
