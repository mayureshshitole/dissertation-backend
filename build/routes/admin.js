"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoute = void 0;
const express_1 = __importDefault(require("express"));
exports.adminRoute = express_1.default.Router();
exports.adminRoute.get("/admin", (req, res) => {
    res.send("this is admin route");
});
// admin routes and permissions
// read admin
// create admin
// update admin
// delete admin
