"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionDB = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
require("dotenv/config");
const connectionDB = mysql2_1.default.createPool({
    host: process.env.host,
    user: process.env.user,
    database: process.env.database,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});
exports.connectionDB = connectionDB;
