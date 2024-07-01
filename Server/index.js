const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
const bodyParser = require('body-parser');
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const io = new Server({
  cors:{
    origin: "http://localhost:3000"
  }
});

const userRoutes = require('./Routes/User.route');
app.use('/authentification', userRoutes);

const carRoutes = require('./Routes/Car.route');
app.use('/car', carRoutes);



mongoose.connect("mongodb+srv://webcamp36:34rkG6lJTQrdzaVx@cluster0.5hmqsyi.mongodb.net/");
mongoose.connection.on("connected", () => {
  console.log("DB connected");
});
mongoose.connection.on("error", (err) => {
  console.log("DB failed with err - ", err);
});

let users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
//username will replace by client username
  socket.on('register', (username) => {
    users[username] = socket.id;
    console.log(`User registered: ${username} with ID: ${socket.id}`);
  });

  socket.on('send-notification', ({ to, message }) => {
    const targetSocketId = users[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit('new-notification', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (let username in users) {
      if (users[username] === socket.id) {
        delete users[username];
        break;
      }
    }
  });
});
io.listen(5000)


app.use(bodyParser.json());

  
const port = process.env.PORT;


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
