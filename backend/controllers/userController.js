const User = require("../models/User");
const generateToken = require("../utils/jwt");
const bcrypt = require("bcryptjs");

// Register a new user
const registerUser = async (req, res) => {
  const { userName, emailID, password, department, role, reportingManager } =
    req.body;

  const userExists = await User.findOne({ emailID });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    userName,
    emailID,
    password: hashedPassword,
    department,
    role,
    reportingManager,
  });

  const createdUser = await user.save();

  if (createdUser) {
    res.status(201).json({
      _id: createdUser._id,
      userName: createdUser.userName,
      emailID: createdUser.emailID,
      token: generateToken(createdUser._id, createdUser.role),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Authenticate user & get token
const authUser = async (req, res) => {
  const { emailID, password } = req.body;

  const user = await User.findOne({ emailID });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      userName: user.userName,
      emailID: user.emailID,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// Get all users (Admin only)
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// Get user by ID
const getUserById = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.userName = req.body.userName || user.userName;
    user.emailID = req.body.emailID || user.emailID;
    user.department = req.body.department || user.department;
    user.reportingManager = req.body.reportingManager || user.reportingManager;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    user.updatedStamp = Date.now();

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      userName: updatedUser.userName,
      emailID: updatedUser.emailID,
      token: generateToken(updatedUser._id, updatedUser.role),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
};
