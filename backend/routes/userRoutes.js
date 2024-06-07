const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  getUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", authUser);

// Protected routes
router.route("/").get(protect, admin, getUsers);
router.route("/getReportingMangers").get(getUsers);

router
  .route("/profile")
  .get(protect, getUserById)
  .put(protect, updateUserProfile);

router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById);

module.exports = router;
