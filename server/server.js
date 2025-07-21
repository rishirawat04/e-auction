import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import http from 'http';
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { Server } from "socket.io";
// Import src utils
import connectDb from "./src/utils/DB/connectDb.js";
import { setupSocket } from "./src/socket/socket.js";
import routes from  "./src/routes/routes.js"
import { checkAuctionEndings } from "./src/utils/auction/auctionTimer.js";
import { udpateAuctionStatusCron } from "./src/middlewares/cron.js";

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  // Load .env file only in development
  dotenv.config({ path: "./.env" });
}

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
    origin: process.env.CLIENT_ORIGIN || '*',
    credentials: true,
  }
})

app.use((req, res, next) => {
  req.io = io;
  next();
});


// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Check every 60 sec
setTimeout(() => checkAuctionEndings(io), 60000);
//Update status of auctions
udpateAuctionStatusCron();
// Routes
app.get("/", (req, res) => {
  res.send("Auth Service is running");
});
app.use("/api/v1", routes);
setupSocket(io)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});


// Start server
const startServer = async () => {
  try {
    await connectDb();

    server.listen(PORT, () => {
      console.log(`✅ Auth Service running with WebSocket on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
