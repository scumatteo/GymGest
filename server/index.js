const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const model = require("./src/models");
const multer = require("multer");
const http = require("http").Server(app);
const io = require("socket.io")(http);

global.appRoot = path.resolve(__dirname);

const PORT = 3001;

mongoose
  .connect("mongodb://localhost/GymGest", {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    model.initializeMongoose();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.use(cors());

//Per gestire i parametri passati nel corpo della richiesta http.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  multer({
    dest: "../uploads/",
    rename: function (fieldname, filename) {
      return filename;
    },
  }).single("image")
);

const routes = require("./src/routes/routes");
routes(app);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

clients = {};

io.on("connection", function (socket) {
  const { id } = socket.client;

  socket.on("info", (msg) => {
    clients[msg.id] = msg.socketId;
  });

  socket.on("chat message", (msg) => {

    io.to(clients[msg.toUser._id]).emit("chat message", msg);
  });

  socket.on("notification", (msg) => {
    io.to(clients[msg.coach._id]).emit("notification", msg);
  })

  socket.on("disconnect", function () {
  });
});

http.listen(PORT, function () {
  console.log("Node API server started on port " + PORT);
});
