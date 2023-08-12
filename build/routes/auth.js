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
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const users_1 = require("../controllers/users");
require("dotenv/config");
exports.authRoute = express_1.default.Router();
exports.authRoute.get("/", (req, res) => {
    res.send("this is auth route");
});
exports.authRoute.get("/google_btn", (req, res) => {
    res.send('<a href="/auth/google">Sign in with google</a>');
});
exports.authRoute.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Loged In",
            user: req.user,
        });
    }
    else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});
exports.authRoute.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});
exports.authRoute.get("/logout", (req, res) => {
    req.logout();
    res.redirect(process.env.FRONTEND_URL);
});
// create user operations
// authRoute.post("/auth_user", (req:any, res:any) => {
//   // extract the body
//   const data = req.body;
//   console.log("inside auth_user")
//   console.log(data)
//   try {
//     // check the use is already added or not
//     let check_existing_user = `select id from tbl_users where google_id='${data.google_id}' and email='${data.email}'`;
//     con.query(check_existing_user, async (err, result: any) => {
//       if (err) throw err;
//       // console.log(result)
//       if (result.length != 0) {
//         console.log(result);
//         res.send(result);
//       } else {
//         console.log("no result adding user to database");
//         let user = await addUser(data);
//         res.send(user);
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });
exports.authRoute.post("/auth_member", (req, res) => {
    // extract the body
    const data = req.body;
    console.log("inside auth_user");
    console.log(data);
    try {
        // check the use is already added or not
        let check_existing_user = `select id from tbl_users where google_id='${data.google_id}' and email='${data.email}'`;
        db_1.connectionDB.query(check_existing_user, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw err;
            // console.log(result)
            if (result.length != 0) {
                console.log(result);
                let userinfo = yield (0, users_1.getUserInfoById)(result[0].id);
                res.send(userinfo);
            }
            else {
                console.log("no result adding user to database");
                let user = yield (0, users_1.addUser)(data);
                res.send(user);
            }
        }));
    }
    catch (error) {
        res.send(error);
    }
});
// get user info
exports.authRoute.post("/get_user_info", (req, res) => {
    let emailid = req.body.email;
    let userInfo_sql = `select * from tbl_users where email='${emailid}'`;
    db_1.connectionDB.query(userInfo_sql, (err, result) => {
        // console.log(userInfo_sql);
        if (err) {
            res.send(err);
        }
        if (result.length != 0) {
            console.log(result);
            res.send(result);
        }
        else {
            res.send("couldn't find any user");
        }
    });
});
// get user info
exports.authRoute.post("/get_user_info_by_id", (req, res) => {
    let input = req.body;
    let userInfo_sql = `select u.*, count(t.id) as tasks_uploaded, count(b.id) as bids from tbl_users as u left join tbl_tasks as t on t.user_id=${input.user_id}
  left join tbl_bids as a on b.helper_id=${input.user_id}
  where u.id='${input.user_id}'`;
    db_1.connectionDB.query(userInfo_sql, (err, result) => {
        // console.log(userInfo_sql);
        if (err) {
            res.send(err);
        }
        if (result.length != 0) {
            console.log(result);
            res.send(result);
        }
        else {
            res.send("couldn't find any user");
        }
    });
});
// add user phone
exports.authRoute.post("/add_user_phone", (req, res) => {
    let updatePhone_sql = `update tbl_users set phone='${req.body.phone}' where id='${req.body.userId}'`;
    db_1.connectionDB.query(updatePhone_sql, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(userInfo_sql);
        if (err) {
            res.send(err);
        }
        if (result) {
            try {
                const userInfo = yield (0, users_1.getUserInfoById)(req.body.userId);
                console.log(userInfo);
                // Process the user information here
                res.send(userInfo);
            }
            catch (error) {
                console.error(error);
                // Handle the error
                res.send(error.message);
            }
            // res.send(info);
        }
        else {
            res.send("couldn't find any user");
        }
    }));
});
///////////////////////////////////////////////////
// Create user endpoint
exports.authRoute.post("/api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, picture } = req.body;
        // Insert user into the database
        const result = yield db_1.connectionDB.query("INSERT INTO users (email, name, picture) VALUES (?, ?, ?)", [email, name, picture]);
        // const userId = result.insertId;
        res.json({ result });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
}));
// Update user location endpoint
exports.authRoute.put("/api/users/:userId/location", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { latitude, longitude } = req.body;
        // Update user location in the database
        yield db_1.connectionDB.query("UPDATE users SET latitude = ?, longitude = ? WHERE id = ?", [latitude, longitude, userId]);
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Error updating user location:", error);
        res.status(500).json({ error: "Failed to update user location" });
    }
}));
// update user
// delete user
