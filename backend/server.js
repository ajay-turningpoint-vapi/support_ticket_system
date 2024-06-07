var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
var port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use("/public", express.static("public"));

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var Users = require("./routes/Users");
var Tickets = require("./routes/Tickets");

app.use("/users", Users);
app.use("/tickets", Tickets);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.listen(port, function () {
  console.log("Server is running on port: " + port);
});
