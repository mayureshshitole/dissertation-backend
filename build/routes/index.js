"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth");
const tasks_1 = require("./tasks");
const admin_1 = require("./admin");
exports.routes = express_1.default.Router();
exports.routes.get("/", (req, res) => {
    res.send("hello, welcome to the NearByHelp");
});
// auth routes
exports.routes.use("/auth", auth_1.authRoute);
// tasks routes
exports.routes.use("/tasks", tasks_1.tasksRoute);
// auth routes
exports.routes.use(admin_1.adminRoute);
