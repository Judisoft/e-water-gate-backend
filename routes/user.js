const express = require("express");
const router = express.Router();

//Handlers from controllers
const {
  login,
  signup,
  sendotp,
  forgotpassword,
  resetpassword,
} = require("../controllers/auth");
const {
  auth,
  isMember,
  isAdmin,
  isSysAdmin,
} = require("../middlewares/authMiddle");
const { getAllUsers } = require("../controllers/UserController");

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgot-password", forgotpassword);
router.post("/reset-password/:token", resetpassword);
router.post("/sendotp", sendotp);
router.get("/users", auth, getAllUsers);

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
