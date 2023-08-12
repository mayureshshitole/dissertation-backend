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
exports.tasksRoute = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const tasks_1 = require("../controllers/tasks");
const generalFunctions_1 = require("../utils/generalFunctions");
exports.tasksRoute = express_1.default.Router();
exports.tasksRoute.get("/", (req, res) => {
    res.send("this is tasks route");
});
//----------------crud operations of the tasks here
// read tasks
exports.tasksRoute.get("/alltasks", (req, res) => {
    try {
        let sql_get_tasks = `select * from tbl_tasks`;
        db_1.connectionDB.query(sql_get_tasks, (err, result) => {
            if (err)
                throw err.message;
            res.send(result);
        });
    }
    catch (error) {
        res.send(error);
    }
});
// read individual tasks
exports.tasksRoute.post("/get_user_tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    try {
        const userTasks = yield (0, tasks_1.getUserTask)(inputs.userId);
        res.send(userTasks);
    }
    catch (error) {
        res.send(error);
    }
}));
// get task by id
exports.tasksRoute.post("/single_task_details", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    try {
        const singleTask = yield (0, tasks_1.singleTaskDetails)(inputs.taskID);
        res.send(singleTask);
    }
    catch (error) {
        res.send(error);
    }
}));
// Single normal task details
exports.tasksRoute.post("/task_details", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    const response = yield (0, tasks_1.taskDetails)(inputs);
    res.send(response);
}));
// delete task by id
exports.tasksRoute.post("/delete_task", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    try {
        const deleteTaskDetails = yield (0, tasks_1.deleteTask)(inputs.taskID);
        res.send(deleteTaskDetails);
    }
    catch (error) {
        res.send(error);
    }
}));
// get nearby tasks by the range
exports.tasksRoute.post("/get_nearby_tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    console.log("inside get nearby locations");
    console.log(inputs);
    const result = yield (0, tasks_1.getNearByTasks)(inputs);
    console.log(result);
    res.send(result);
}));
// get only open tasks tasks
exports.tasksRoute.get("/tasks/get_user_tasks", (req, res) => {
    try {
        let sql_get_task = `select * from tbl_tasks where is_open=1`;
        db_1.connectionDB.query(sql_get_task, (err, result) => {
            if (err)
                throw err.message;
            res.send(result);
        });
    }
    catch (error) {
        res.send(error);
    }
});
// create tasks
exports.tasksRoute.post("/create_user_tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    let data_model = {
        user_id: inputs.user_id,
        added_at: (0, generalFunctions_1.toUnixDateTime)(new Date()),
        deadline: inputs.deadline,
        title: inputs.title,
        budget: inputs.budget,
        description: inputs.description,
        latitude: inputs.latitude,
        longitude: inputs.longitude,
    };
    console.log("adding user's task");
    console.log(data_model);
    // calling a function to add a tasks and sending a response
    const taskAddRes = yield (0, tasks_1.createTask)(data_model);
    res.send(taskAddRes);
}));
// update tasks
exports.tasksRoute.post("/update_user_tasks", (req, res) => {
    let inputs = req.body;
    let data_model = {
        id: inputs.id,
        user: inputs.user_name,
        user_id: inputs.user_id,
        datetime: inputs.datetime,
        latitude: inputs.latitude,
        longitude: inputs.longitude,
    };
    try {
        let sql_update_user_tasks = `update tbl_tasks set ?`;
        db_1.connectionDB.query(sql_update_user_tasks, data_model, (err, result) => {
            if (err)
                throw err.message;
            res.send(result);
        });
    }
    catch (error) {
        res.send(error);
    }
});
// delete tasks
exports.tasksRoute.post("/delete_user_tasks", (req, res) => {
    let inputs = req.body;
    let data_model = {
        id: inputs.id,
        user_id: inputs.user_id,
        is_open: 0,
    };
    try {
        let sql_delete_user_tasks = `insert into tbl_tasks set ?`;
        db_1.connectionDB.query(sql_delete_user_tasks, data_model, (err, result) => {
            if (err)
                throw err.message;
            res.send(result);
        });
    }
    catch (error) {
        res.send(error);
    }
});
// done the task with helper name
exports.tasksRoute.post("/task_done", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    let data_model = {
        user_id: inputs.user_id,
        task_id: inputs.task_id,
        helper_id: inputs.helper_id,
        done_at: (0, generalFunctions_1.toUnixDateTime)(new Date()),
    };
    const response = yield (0, tasks_1.taskDone)(data_model);
    res.send(response);
}));
// done the task with helper name
exports.tasksRoute.post("/make_bid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    let data_model = {
        task_id: inputs.task_id,
        helper_id: inputs.helper_id,
        budget: inputs.budget,
        comment: inputs.comment,
        bid_at: (0, generalFunctions_1.toUnixDateTime)(new Date()),
    };
    const response = yield (0, tasks_1.makeBid)(data_model);
    res.send(response);
}));
// appoint helper by bid
exports.tasksRoute.post("/appoint_helper_by_bid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    let data_model = {
        task_id: inputs.task_id,
        helper_id: inputs.helper_id,
        bid_id: inputs.bid_id,
    };
    const response = yield (0, tasks_1.appointHelperByBid)(data_model);
    res.send(response);
}));
// appoint helper directly
exports.tasksRoute.post("/appoint_helper_directly", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    let data_model = {
        task_id: inputs.task_id,
        helper_id: inputs.helper_id,
    };
    const response = yield (0, tasks_1.appointHelperDirectly)(data_model);
    res.send(response);
}));
// appoint helper directly
exports.tasksRoute.post("/cancel_appointed_helper", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    let data_model = {
        task_id: inputs.task_id,
        helper_id: inputs.helper_id,
        bid_id: inputs.bid_id,
    };
    const response = yield (0, tasks_1.cancelAppointedHelper)(data_model);
    res.send(response);
}));
// get applied tasks
exports.tasksRoute.post("/get_applied_tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    let data_model = {
        helper_id: inputs.helper_id,
    };
    const response = yield (0, tasks_1.getAppliedTasks)(data_model);
    res.send(response);
}));
// get applied tasks
exports.tasksRoute.post("/get_assigned_tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputs = req.body;
    let data_model = {
        helper_id: inputs.helper_id,
    };
    const response = yield (0, tasks_1.getAssignedTasks)(data_model);
    res.send(response);
}));
