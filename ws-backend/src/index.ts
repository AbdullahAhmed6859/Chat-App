import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8000 });

wss.on("connection", function connection(socket) {
  socket.send("Hello from the server");
  console.log("user connected");

  socket.on("message", (rawData) => {
    const strData = rawData.toString();
    console.log(strData);
    if (strData === "ping") {
      socket.send("pong");
    }
  });
});

console.log("WebSocket server has started");
