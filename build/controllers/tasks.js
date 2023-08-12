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
exports.getAssignedTasks = exports.getAppliedTasks = exports.cancelAppointedHelper = exports.appointHelperDirectly = exports.appointHelperByBid = exports.makeBid = exports.taskDone = exports.deleteTask = exports.taskDetails = exports.singleTaskDetails = exports.getUserTask = exports.createTask = exports.getNearByTasks = void 0;
const db_1 = require("../db");
const users_1 = require("./users");
// create a task
const createTask = (taskInput) => __awaiter(void 0, void 0, void 0, function* () {
    const sql_create_task = `insert into tbl_tasks set ?`;
    try {
        return new Promise((resolve, reject) => {
            db_1.connectionDB.query(sql_create_task, taskInput, (err, result) => {
                if (err) {
                    reject(err.message);
                }
                resolve(result);
            });
        });
    }
    catch (error) {
        return error.message;
    }
});
exports.createTask = createTask;
// get individual user's task by userId
const getUserTask = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(user_id);
    let sql_get_task = `select * from tbl_tasks where user_id=${user_id} order by FROM_UNIXTIME(added_at) desc`;
    return new Promise((resolve, reject) => {
        db_1.connectionDB.query(sql_get_task, (err, result) => {
            console.log(sql_get_task);
            if (err)
                reject(err.message);
            resolve(result);
        });
    });
});
exports.getUserTask = getUserTask;
// get single task details
const singleTaskDetails = (taskID) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(taskID);
    let sql_single_task = `select * from tbl_tasks where id=${taskID}`;
    const taskDetails = yield new Promise((resolve, reject) => {
        db_1.connectionDB.query(sql_single_task, (err, result) => {
            if (err)
                reject(err.message);
            resolve(result);
        });
    });
    const sql_bid_list = `select b.*, h.name from tbl_bids as b left join tbl_users as h on h.id=b.helper_id where b.task_id=${taskID}`;
    const bidList = yield new Promise((resolve1, reject1) => {
        db_1.connectionDB.query(sql_bid_list, (err1, result1) => {
            if (err1)
                reject1(err1.message);
            resolve1(result1);
        });
    });
    const helperDetails = taskDetails[0].is_assigned === 1 && taskDetails[0].helper_id != null
        ? yield (0, users_1.getUserInfoById)(taskDetails[0].helper_id)
        : [];
    taskDetails[0].bid_list = bidList;
    taskDetails[0].helper_details = helperDetails;
    return taskDetails;
});
exports.singleTaskDetails = singleTaskDetails;
// get single task details
const taskDetails = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(inputs);
    let sql_single_task = `select t.*,u.name as poster_name,u.phone as poster_phone, exists(select b.id from tbl_bids as b where b.helper_id=${inputs.user_id} and b.task_id=${inputs.task_id} ) as is_bided from tbl_tasks as t left join tbl_users as u on u.id=t.user_id where t.id=${inputs.task_id}`;
    const taskDetails = yield new Promise((resolve, reject) => {
        db_1.connectionDB.query(sql_single_task, (err, result) => {
            if (err)
                reject(err.message);
            resolve(result);
        });
    });
    return taskDetails;
});
exports.taskDetails = taskDetails;
// get applied tasks list
const getAppliedTasks = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(inputs);
    let sql_single_task = `SELECT t.*,b.budget as your_budget,b.comment,b.bid_at, b.is_selected, b.id as bid_id
  FROM helper.tbl_tasks as t 
  left join helper.tbl_bids as b on b.task_id=t.id
  where b.helper_id=${inputs.helper_id} order by t.id desc`;
    const taskDetails = yield new Promise((resolve, reject) => {
        db_1.connectionDB.query(sql_single_task, (err, result) => {
            if (err)
                reject(err.message);
            resolve(result);
        });
    });
    return taskDetails;
});
exports.getAppliedTasks = getAppliedTasks;
// get applied tasks list
const getAssignedTasks = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(inputs);
    let sql_single_task = `SELECT t.*,b.budget as your_budget,b.comment,b.bid_at, b.is_selected, b.id as bid_id
  FROM helper.tbl_tasks as t 
  left join helper.tbl_bids as b on b.task_id=t.id
  where b.helper_id=${inputs.helper_id} and b.is_selected=1 order by t.id desc`;
    const taskDetails = yield new Promise((resolve, reject) => {
        db_1.connectionDB.query(sql_single_task, (err, result) => {
            if (err)
                reject(err.message);
            resolve(result);
        });
    });
    return taskDetails;
});
exports.getAssignedTasks = getAssignedTasks;
// delete task details
const deleteTask = (taskID) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(taskID);
    let sql_delete_task = `update tbl_tasks set is_open=2 where id=${taskID}`;
    return new Promise((resolve, reject) => {
        db_1.connectionDB.query(sql_delete_task, (err, result) => {
            // console.log(sql_single_task);
            if (err)
                reject(err.message);
            resolve(result);
        });
    });
});
exports.deleteTask = deleteTask;
// get the nearby task
const getNearByTasks = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql_get_nearby_tasks = `SELECT *, round(6371 * 2 * ASIN(
          SQRT(
              POWER(SIN((RADIANS(${inputs.latitude}) - RADIANS(latitude)) / 2), 2) +
              COS(RADIANS(${inputs.latitude})) * COS(RADIANS(latitude)) * POWER(SIN((RADIANS(${inputs.longitude}) - RADIANS(longitude)) / 2), 2)
            )
        ),2) AS distance 
        FROM tbl_tasks
        where user_id != ${inputs.user_id} and is_assigned=0 
        having distance <= ${inputs.range}
        order by distance asc`;
        return new Promise((resolve, reject) => {
            db_1.connectionDB.query(sql_get_nearby_tasks, (err, result) => {
                console.log(sql_get_nearby_tasks);
                console.log(result);
                if (err)
                    reject(err.message);
                return resolve(result);
            });
        });
    }
    catch (error) {
        return error.message;
    }
});
exports.getNearByTasks = getNearByTasks;
// complete the task
const taskDone = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(inputs);
    try {
        const sql_task_done = `insert into tbl_tasks_done set ? `;
        return new Promise((resolve, reject) => {
            db_1.connectionDB.query(sql_task_done, inputs, (err, result) => {
                if (err)
                    reject(err.message);
                resolve(result);
            });
        });
    }
    catch (error) {
        return error.message;
    }
});
exports.taskDone = taskDone;
// make a bid
const makeBid = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(inputs);
    try {
        const sql_make_bid = `insert into tbl_bids set ?`;
        return new Promise((resolve, reject) => {
            db_1.connectionDB.query(sql_make_bid, inputs, (err, result) => {
                if (err)
                    reject(err.message);
                resolve(result);
            });
        });
    }
    catch (error) {
        return error.message;
    }
});
exports.makeBid = makeBid;
// appoint helper by bid
const appointHelperByBid = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(inputs);
    try {
        const sql_appoint_helper = `update tbl_bids set is_selected=1 where id=${inputs.bid_id}`;
        return new Promise((resolve, reject) => {
            db_1.connectionDB.query(sql_appoint_helper, (err, result) => {
                console.log(sql_appoint_helper);
                // update tasks table is_assigned value
                const sql_update_tasks_table = `update tbl_tasks set is_assigned=1,helper_id=${inputs.helper_id} where id=${inputs.task_id}`;
                if (err)
                    reject(err.message);
                if (result) {
                    db_1.connectionDB.query(sql_update_tasks_table, (err1, result1) => {
                        if (err1)
                            reject(err1.message);
                        resolve(result1);
                    });
                }
                else {
                    reject("Something went wrong");
                }
            });
        });
    }
    catch (error) {
        return error.message;
    }
});
exports.appointHelperByBid = appointHelperByBid;
// appoint helper by bid
const appointHelperDirectly = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(inputs);
    try {
        const sql_appoint_helper_directly = `update tbl_tasks set is_assigned=1,helper_id=${inputs.helper_id} where id=${inputs.task_id}`;
        return new Promise((resolve, reject) => {
            db_1.connectionDB.query(sql_appoint_helper_directly, (err, result) => {
                console.log(sql_appoint_helper_directly);
                if (err)
                    reject(err.message);
                resolve(result);
            });
        });
    }
    catch (error) {
        return error.message;
    }
});
exports.appointHelperDirectly = appointHelperDirectly;
// cancel appointed helper
const cancelAppointedHelper = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(inputs);
    try {
        const sql_update_appoint_helper = `update tbl_bids set is_selected=0 where task_id=${inputs.task_id}`;
        return new Promise((resolve, reject) => {
            db_1.connectionDB.query(sql_update_appoint_helper, (err, result) => {
                console.log(sql_update_appoint_helper);
                // update tasks table is_assigned value
                const sql_update_tasks_table = `update tbl_tasks set is_assigned=0,helper_id=null where id=${inputs.task_id}`;
                if (err)
                    reject(err.message);
                if (result) {
                    db_1.connectionDB.query(sql_update_tasks_table, (err1, result1) => {
                        if (err1)
                            reject(err1.message);
                        resolve(result1);
                    });
                }
                else {
                    reject("Something went wrong");
                }
            });
        });
    }
    catch (error) {
        return error.message;
    }
});
exports.cancelAppointedHelper = cancelAppointedHelper;
