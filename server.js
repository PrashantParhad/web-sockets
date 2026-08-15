import http from "node:http";
import { WebSocketServer } from "ws";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 3000;

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
  console.log("New WebSocket connection established...");
  websocket.on("message", (data) => {
    console.log("message received", data.toString());
    websocket.send("Hello from the server!");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
