import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8000 });

interface User {
  socket: WebSocket;
  room: string;
}

let allUsers: User[] = [];

wss.on("connection", function connection(socket) {
  console.log("connection request recieved");
  if (!allUsers.some((user) => user.socket === socket)) {
    allUsers.push({
      socket,
      room: "defaultRoom",
    });
  }

  socket.send("User Connected #" + allUsers.length);

  socket.on("message", (rawData) => {
    const strData = rawData.toString();

    const data = JSON.parse(strData);
    if (data.type === "join") {
      allUsers.forEach((user) => {
        if (user.socket === socket) {
          user.room = data.payload.room;
        }
      });
      socket.send("You have joined: " + data.payload.room);
    }

    if (data.type === "chat") {
      const currentUsersRoom = allUsers.find(
        (user) => user.socket == socket
      )?.room;
      allUsers.forEach((user) => {
        if (user.room === currentUsersRoom && user.socket !== socket) {
          user.socket.send(data.payload.message);
        }
      });
    }
  });

  socket.on("close", () => {
    allUsers = allUsers.filter((user) => user.socket !== socket);
  });
});

console.log("WebSocket server has started");
