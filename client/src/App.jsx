import { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { TextField, Button, Typography, Stack } from "@mui/material";

export default function App() {
  const socket = useMemo(() => io(`http://localhost:3004`), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(messages);
  // function handle form submit
  function handleFormSubmit(e) {
    e.preventDefault();

    socket.emit("message", { message, room });
    setMessage("");
  }

  // function  handle data change
  function handleDataChange(e) {
    setMessage(e.target.value);

    // inputMessage = e.target.value;
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    // socket.on("welcome", (s) => {
    //   console.log(`User ${socketId} joined the server`, s);
    // });
    socket.on("opened", (s) => {
      console.log(s);
    });
    socket.on("userMessage", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div>
      <Typography variant="p" component="div" gutterBottom>
        {socketId}
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <TextField
          id="outlined-basic"
          label="Message"
          variant="outlined"
          value={message}
          onChange={handleDataChange}
          margin="dense"
        />

        <TextField
          id="outlined-basic"
          label="Room"
          variant="outlined"
          value={room}
          margin="dense"
          onChange={(e) => {
            setRoom(e.target.value);
          }}
        />
        <Button variant="contained" type="submit">
          Send
        </Button>
      </form>

      {messages.map((message, index) => (
        <Typography variant="h6" key={index} component="h6" gutterBottom>
          {console.log("From chatbox", message)}
          {message}
        </Typography>
      ))}
    </div>
  );
}
