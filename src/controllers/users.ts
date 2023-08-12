import { resolve } from "path";
import { connectionDB as con } from "../db";

const getUserInfoByEmail = async (emailid: string) => {
  let userInfo_sql = `select * from tbl_users where email='${emailid}'`;
  con.query(userInfo_sql, (err, result: any) => {
    // console.log(userInfo_sql);
    if (err) {
      return err;
    }
    if (result.length != 0) {
      //   console.log(result);
      return result;
    } else {
      return "couldn't find any user";
    }
  });
};
const getUserInfoById = (userid: number) => {
  return new Promise((resolve, reject) => {
    let userInfo_sql = `select * from tbl_users where id=${userid}`;
    con.query(userInfo_sql, (err, result: any) => {
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

const addUser = async (data: any) => {
  console.log(data);
  let add_user_sql = `insert into tbl_users set ?`;
  return new Promise((resolve, reject) => {
    con.query(add_user_sql, data, async (err, result: any) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(result);
        console.log(result.insertId);
        //   return the user info
        let userinfo = await getUserInfoById(result.insertId);
        resolve(userinfo);
      }
    });
  });
};

export { addUser, getUserInfoByEmail, getUserInfoById };
