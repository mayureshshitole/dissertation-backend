import express from "express";

export const adminRoute = express.Router();

adminRoute.get("/admin", (req: any, res: any) => {
  res.send("this is admin route");
});

// admin routes and permissions


// read admin

// create admin

// update admin

// delete admin
