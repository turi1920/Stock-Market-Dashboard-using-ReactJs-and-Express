const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Stock Market Server is running!");
});

const fetchStockPrices = async () => {
    //Data for the api
  const mockStockData = {
    AAPL: Math.random() * 100 + 150,
    TSLA: Math.random() * 1000 + 700,
    AMZN: Math.random() * 200 + 3000,
    GOOGL: Math.random() * 50 + 2800,
  };
  return mockStockData;
};

// Send stock data to clients every 5 seconds
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const sendStockUpdates = async () => {
    const stockData = await fetchStockPrices();
    socket.emit("stockData", stockData);
  };

  const intervalId = setInterval(sendStockUpdates, 5000);

  // Clean up when a client disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    clearInterval(intervalId);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
