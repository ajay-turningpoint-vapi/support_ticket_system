const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true, // Assuming username is required
  },
  department: {
    type: String,
    required: true, // Assuming department is required
  },
  emailID: {
    type: String,
    required: true,
    unique: true, // Assuming email should be unique
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  reportingManager: {
    type: String, // You can use Schema.Types.ObjectId if referring to another User
  },
  createdStamp: {
    type: Date,
    default: Date.now,
  },
  updatedStamp: {
    type: Date,
  },
});

module.exports = mongoose.model("User", UserSchema);
