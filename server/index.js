import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
import { PORT } from "./config/serverConfig.js";

// middlewares

app.use(cors);

const server = new createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id, "Hello from socket, User Connected - from server");
  // socket.emit("welcome", "Welcome to the server bro!");
  socket.broadcast.emit("opened", `${socket.id} joined the server`);

  socket.on("message", ({ message, room }) => {
    console.log(message, room);
    socket.to(room).emit("userMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello");
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
