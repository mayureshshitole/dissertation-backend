import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import cookieSession from "cookie-session";
import cluster from "cluster";
import { cpus } from "os";
let cpuLength = cpus().length;

import { routes } from "./routes";

const app = express();
const PORT = process.env.PORT;

// ------declaring all middle-wares
app.use(express.json());
// body parsers
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// compression for better speed and compressed req and res
app.use(compression());
// helmet pkg for secure express http responses headers
app.use(helmet());
// cors middleware
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     methods: "GET,PUT,POST,DELETE",
//     credentials: true,
//   })
// );
// cookie session
app.use(
  cookieSession({
    name: "session",
    keys: ["mantisus"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// routes
app.use("/", routes);

// clustering

if (cluster.isPrimary) {
  console.log(`Number of CPUs is ${cpuLength}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < cpuLength; i++) {
    // console.log(`fork the cluster`);
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
  
} else {
  const startTheApp = async () => {
    try {
      app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started`);
        console.log(`Server running on ${PORT}`);
      });
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  };
  startTheApp();
}
