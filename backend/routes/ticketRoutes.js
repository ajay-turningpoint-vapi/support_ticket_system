const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createTicket,
  getTickets,
  getUserTickets,
  updateTicket,
  deleteTicket,
  addMessages,
  filterStatus,
  getTicketsUsers,
} = require("../controllers/ticketController");
const { protect, admin } = require("../middleware/authMiddleware");
const DIR = "public/";
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname.toLowerCase().split(" ").join("-")
    );
  },
});

var upload = multer({
  storage: storage,
});

// Routes for tickets
router.route("/").post(protect, createTicket).get(protect, admin, getTickets);
router.route("/mytickets").get(protect, getUserTickets);
router.route("/addMessages").post(protect, upload.array("img"), addMessages);
router.route("/usersTickets").get(protect, getTicketsUsers);
router
  .route("/:id")
  .put(protect, updateTicket)
  .delete(protect, admin, deleteTicket);

router.route("/filterStatus").post(filterStatus);

module.exports = router;
