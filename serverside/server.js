const WebSocket = require("ws");
const data = require("./inputUpdates.json");
require("dotenv").config();

const server = new WebSocket.Server({ port: process.env.port });

server.on("connection", (socket) => {
  console.log("Connected to listener");

  let orders = data;

  // Send the order update after certain delay
  const sendUpdates = (updates, delay) => {
    setTimeout(() => {
      updates.forEach((update) => {
        socket.send(
          JSON.stringify({
            update,
            logs: `Update sent to order book at ${new Date().toISOString()} for client ${
              update.ClientID
            } : ${JSON.stringify(update)}`,
          })
        );
      });
    }, delay);
  };

  sendUpdates(orders.slice(0, 10), 1000);
  sendUpdates(orders.slice(10, 30), 3000);
  sendUpdates(orders.slice(30, 70), 6000);
  sendUpdates(orders.slice(70, 100), 11000);
});

console.log("WebSocket server started");
