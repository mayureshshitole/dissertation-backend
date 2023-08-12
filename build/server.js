"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = require("os");
let cpuLength = (0, os_1.cpus)().length;
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const PORT = process.env.PORT;
// ------declaring all middle-wares
app.use(express_1.default.json());
// body parsers
app.use(body_parser_1.default.json({ limit: "50mb", type: "application/json" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
// compression for better speed and compressed req and res
app.use((0, compression_1.default)());
// helmet pkg for secure express http responses headers
app.use((0, helmet_1.default)());
// cors middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
}));
// cookie session
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: ["mantisus"],
    maxAge: 24 * 60 * 60 * 100,
}));
// routes
app.use("/", routes_1.routes);
// clustering
if (cluster_1.default.isPrimary) {
    console.log(`Number of CPUs is ${cpuLength}`);
    console.log(`Master ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < cpuLength; i++) {
        // console.log(`fork the cluster`);
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster_1.default.fork();
    });
}
else {
    const startTheApp = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            app.listen(PORT, () => {
                console.log(`Worker ${process.pid} started`);
                console.log(`Server running on ${PORT}`);
            });
            console.log("Connection has been established successfully.");
        }
        catch (error) {
            console.error("Unable to connect to the database:", error);
        }
    });
    startTheApp();
}
