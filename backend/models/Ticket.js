const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { text } = require("express");
const timeZone = moment.tz(Date.now(), "Europe/Istanbul");
const Schema = mongoose.Schema;

// Create Schema
const messages = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  date: {
    type: Date,
    default: timeZone,
  },
  img: {
    type: String,
  },
});

const TicketSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  messages: {
    type: [messages], // Assuming messages is an array of strings
  },
  status: {
    type: Number,
    default: 0,
  },

  priority: {
    type: String,
  },
  currentUser: { type: Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  assignToUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdTimeStamp: {
    type: Date,
    default: Date.now,
  },
  TAT: {
    type: Number,
  },
  updatedTimeStamp: {
    type: Date,
  },
  closingTimeStamp: {
    type: Date,
    default: null,
  },
});

module.exports = User = mongoose.model("ticket", TicketSchema);
