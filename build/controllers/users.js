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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfoById = exports.getUserInfoByEmail = exports.addUser = void 0;
const db_1 = require("../db");
const getUserInfoByEmail = (emailid) => __awaiter(void 0, void 0, void 0, function* () {
    let userInfo_sql = `select * from tbl_users where email='${emailid}'`;
    db_1.connectionDB.query(userInfo_sql, (err, result) => {
        // console.log(userInfo_sql);
        if (err) {
            return err;
        }
        if (result.length != 0) {
            //   console.log(result);
            return result;
        }
        else {
            return "couldn't find any user";
        }
    });
});
exports.getUserInfoByEmail = getUserInfoByEmail;
const getUserInfoById = (userid) => {
    return new Promise((resolve, reject) => {
        let userInfo_sql = `select * from tbl_users where id=${userid}`;
        db_1.connectionDB.query(userInfo_sql, (err, result) => {
            console.log("inside get info by id");
            console.log(userInfo_sql);
            if (err) {
                reject(err); // Reject the promise with the error
            }
            console.log(result);
            resolve(result); // Resolve the promise with the query result
        });
    });
};
exports.getUserInfoById = getUserInfoById;
const addUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    let add_user_sql = `insert into tbl_users set ?`;
    return new Promise((resolve, reject) => {
        db_1.connectionDB.query(add_user_sql, data, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                console.log(result);
                console.log(result.insertId);
                //   return the user info
                let userinfo = yield getUserInfoById(result.insertId);
                resolve(userinfo);
            }
        }));
    });
});
exports.addUser = addUser;
