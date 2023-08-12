import express from "express";
import { Router } from "express";

import { connectionDB as con } from "../db";
import { authRoute } from "./auth";
import { tasksRoute } from "./tasks";
import { adminRoute } from "./admin";

export const routes = express.Router();

routes.get("/", (req: any, res: any) => {
  
  res.send("hello, welcome to the NearByHelp");
});

// auth routes
routes.use("/auth", authRoute);
// tasks routes
routes.use("/tasks", tasksRoute);
// auth routes
routes.use(adminRoute);
