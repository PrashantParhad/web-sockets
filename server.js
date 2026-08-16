import http from "node:http";
import { WebSocketServer } from "ws";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 3001;

const httpServer = http.createServer(async (req, res) => {
  const indexFile = await fs.promises.readFile(
    path.resolve("./index.html"),
    "utf-8",
  );
  res.setHeader("Content-Type", "text/html");
  // res.writeHead(200);
  res.end(indexFile);
});

const wsServer = new WebSocketServer({ server: httpServer });

wsServer.on("connection", (websocket) => {
  console.log("Server : New WebSocket connection established...");

  websocket.on("message", (data) => {
    console.log("message received :", data.toString());
    // websocket.send(data.toString()); //sends the message back to the same client

    // broadcast the message to all connected clients
    wsServer.clients.forEach((client) => {
      client.send(data.toString());
    });
  });

  // websocket.on("message", (data) => {
  //   console.log("message received :", data.toString());
  //   websocket.send("Hello from the server!", data);
  // });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
