const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");

const createTicket = async (req, res) => {
  try {
    const { name, priority, TAT, assignToUsers } = req.body;

    // Log the currentUser and createdBy to ensure they are set correctly
    console.log("currentUser:", req.user._id);
    console.log("createdBy:", req.user._id);

    // Parse and convert assignToUsers to an array of ObjectIds
    console.log("body", req.body);
    let assignToUsersArray;
    if (typeof assignToUsers === "string") {
      assignToUsersArray = JSON.parse(assignToUsers).map((id) =>
        mongoose.Types.ObjectId(id)
      );
    } else {
      assignToUsersArray = assignToUsers.map((id) =>
        mongoose.Types.ObjectId(id)
      );
    }

    const ticket = new Ticket({
      name,
      priority,
      TAT,
      currentUser: req.user._id,
      createdBy: req.user._id,
      assignToUsers: assignToUsersArray,
    });

    const createdTicket = await ticket.save();

    // Log the created ticket document to check if fields are correctly inserted
    console.log("Created Ticket:", createdTicket);

    res.status(201).json(createdTicket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Error creating ticket" });
  }
};
// Get all tickets (Admin only)
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .populate("currentUser", "userName") // Populate currentUser with selected fields
      .populate("createdBy", "userName") // Populate createdBy with selected fields
      .populate("assignToUsers", "userName")
      .sort({ createdTimeStamp: -1 }); // Populate assignToUsers with selected fields

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

const getTicketsUsers = async (req, res) => {
  try {
    // Get the status query parameter from the request
    const { status } = req.query;

    // Construct the filter object based on the status parameter
    const filter = { assignToUsers: req.user._id };
    if (status !== undefined) {
      filter.status = status;
    }

    // Use the filter object to find tickets
    const tickets = await Ticket.find(filter)
      .populate("currentUser", "userName")
      .populate("createdBy", "userName")
      .populate("assignToUsers", "userName");

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

// Get tickets for current user
const getUserTickets = async (req, res) => {
  const tickets = await Ticket.find({ currentUser: req.user._id });
  res.json(tickets);
};
const addMessages = async (req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Uploaded files:", req.files);

  // Check if files were uploaded
  const uploadedFile =
    req.files && req.files.length > 0 ? req.files[0].filename : null;

  const newMessage = {
    userName: req.user.userName,
    img: uploadedFile,
    text: req.body.messages,
  };

  Ticket.update(
    {
      _id: req.body.id,
    },
    {
      $push: {
        messages: newMessage,
      },
    },
    function (err, row) {
      if (err) {
        res.json({
          error: err,
        });
      } else {
        res.json({
          code: 1,
          message: row,
        });
      }
    }
  );
};

const filterStatus = (req, res) => {
  console.log("filterstatus");
  console.log(req);
  Ticket.find(
    {
      status: req.body.status,
    },
    (err, items) => {
      if (err) {
        console.log(err);
      } else {
        //   res.render('tickets', { items: items });
        console.log(items);
        res.json(items);
      }
    }
  );
};

// Update ticket
const updateTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (ticket) {
    ticket.name = req.body.name || ticket.name;
    ticket.content = req.body.content || ticket.content;
    ticket.priority = req.body.priority || ticket.priority;
    ticket.status = req.body.status;
    ticket.updatedTimeStamp = Date.now();
    if (ticket.status === 2) {
      ticket.closingTimeStamp = Date.now();
    }
    if (ticket.status === 1 || ticket.status === 2) {
      ticket.currentUser = req.user._id;
    }
    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } else {
    res.status(404).json({ message: "Ticket not found" });
  }
};

// Delete ticket
const deleteTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (ticket) {
    await ticket.remove();
    res.json({ message: "Ticket removed" });
  } else {
    res.status(404).json({ message: "Ticket not found" });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getUserTickets,
  updateTicket,
  deleteTicket,
  addMessages,
  filterStatus,
  getTicketsUsers,
};
