const express = require("express");
const router = express.Router();

//Handlers from controllers
const {
  logIn,
  signUp,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const {
  auth,
  isMember,
  isAdmin,
  isSysAdmin,
} = require("../middlewares/authMiddle");
const { getAllUsers, getSingleUser } = require("../controllers/UserController");

router.post("/login", logIn);
router.post("/signup", signUp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/users", auth, getAllUsers);
router.get("/users/:user_id", getSingleUser);

//testing protected route
router.get("/test", auth, (req, res) => {
  res.json({
    success: true,
    message: "You are a valid Tester 👨‍💻",
  });
});
//protected routes
router.get("/member", auth, isMember, (req, res) => {
  res.json({
    success: true,
    message: "You are a valid Member 🧑‍🎓",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "You are a valid Admin 😎",
  });
});

module.exports = router;
