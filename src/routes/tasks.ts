import express from "express";
import { connectionDB as con } from "../db";
import {
  appointHelperByBid,
  appointHelperDirectly,
  cancelAppointedHelper,
  createTask,
  deleteTask,
  getAppliedTasks,
  getAssignedTasks,
  getNearByTasks,
  getUserTask,
  makeBid,
  singleTaskDetails,
  taskDetails,
  taskDone,
} from "../controllers/tasks";
import { toUnixDateTime } from "../utils/generalFunctions";
export const tasksRoute = express.Router();

tasksRoute.get("/", (req: any, res: any) => {
  res.send("this is tasks route");
});

//----------------crud operations of the tasks here

// read tasks
tasksRoute.get("/alltasks", (req: any, res: any) => {
  try {
    let sql_get_tasks = `select * from tbl_tasks`;
    con.query(sql_get_tasks, (err, result) => {
      if (err) throw err.message;
      res.send(result);
    });
  } catch (error) {
    res.send(error);
  }
});

// read individual tasks
tasksRoute.post("/get_user_tasks", async (req: any, res: any) => {
  let inputs = req.body;

  try {
    const userTasks = await getUserTask(inputs.userId);
    res.send(userTasks);
  } catch (error) {
    res.send(error);
  }
});

// get task by id
tasksRoute.post("/single_task_details", async (req: any, res: any) => {
  let inputs = req.body;
  try {
    const singleTask = await singleTaskDetails(inputs.taskID);
    res.send(singleTask);
  } catch (error) {
    res.send(error);
  }
});

// Single normal task details
tasksRoute.post("/task_details", async (req: any, res: any) => {
  let inputs = req.body;

  const response = await taskDetails(inputs);
  res.send(response);
});

// delete task by id
tasksRoute.post("/delete_task", async (req: any, res: any) => {
  let inputs = req.body;
  try {
    const deleteTaskDetails = await deleteTask(inputs.taskID);
    res.send(deleteTaskDetails);
  } catch (error) {
    res.send(error);
  }
});

// get nearby tasks by the range
tasksRoute.post("/get_nearby_tasks", async (req: any, res: any) => {
  let inputs = req.body;
  console.log("inside get nearby locations");
  console.log(inputs);
  const result = await getNearByTasks(inputs);
  console.log(result);
  res.send(result);
});

// get only open tasks tasks
tasksRoute.get("/tasks/get_user_tasks", (req: any, res: any) => {
  try {
    let sql_get_task = `select * from tbl_tasks where is_open=1`;
    con.query(sql_get_task, (err, result) => {
      if (err) throw err.message;
      res.send(result);
    });
  } catch (error) {
    res.send(error);
  }
});

// create tasks
tasksRoute.post("/create_user_tasks", async (req: any, res: any) => {
  let inputs = req.body;

  let data_model = {
    user_id: inputs.user_id,
    added_at: toUnixDateTime(new Date()),
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
  const taskAddRes = await createTask(data_model);
  res.send(taskAddRes);
});

// update tasks
tasksRoute.post("/update_user_tasks", (req: any, res: any) => {
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
    con.query(sql_update_user_tasks, data_model, (err, result) => {
      if (err) throw err.message;
      res.send(result);
    });
  } catch (error) {
    res.send(error);
  }
});

// delete tasks
tasksRoute.post("/delete_user_tasks", (req: any, res: any) => {
  let inputs = req.body;

  let data_model = {
    id: inputs.id,
    user_id: inputs.user_id,
    is_open: 0,
  };

  try {
    let sql_delete_user_tasks = `insert into tbl_tasks set ?`;
    con.query(sql_delete_user_tasks, data_model, (err, result) => {
      if (err) throw err.message;
      res.send(result);
    });
  } catch (error) {
    res.send(error);
  }
});

// done the task with helper name
tasksRoute.post("/task_done", async (req: any, res: any) => {
  let inputs = req.body;

  let data_model = {
    user_id: inputs.user_id,
    task_id: inputs.task_id,
    helper_id: inputs.helper_id,
    done_at: toUnixDateTime(new Date()),
  };
  const response = await taskDone(data_model);
  res.send(response);
});

// done the task with helper name
tasksRoute.post("/make_bid", async (req: any, res: any) => {
  let inputs = req.body;

  let data_model = {
    task_id: inputs.task_id,
    helper_id: inputs.helper_id,
    budget: inputs.budget,
    comment: inputs.comment,
    bid_at: toUnixDateTime(new Date()),
  };
  const response = await makeBid(data_model);
  res.send(response);
});

// appoint helper by bid
tasksRoute.post("/appoint_helper_by_bid", async (req: any, res: any) => {
  let inputs = req.body;

  let data_model = {
    task_id: inputs.task_id,
    helper_id: inputs.helper_id,
    bid_id: inputs.bid_id,
  };
  const response = await appointHelperByBid(data_model);
  res.send(response);
});

// appoint helper directly
tasksRoute.post("/appoint_helper_directly", async (req: any, res: any) => {
  let inputs = req.body;

  let data_model = {
    task_id: inputs.task_id,
    helper_id: inputs.helper_id,
  };
  const response = await appointHelperDirectly(data_model);
  res.send(response);
});

// appoint helper directly
tasksRoute.post("/cancel_appointed_helper", async (req: any, res: any) => {
  let inputs = req.body;

  let data_model = {
    task_id: inputs.task_id,
    helper_id: inputs.helper_id,
    bid_id: inputs.bid_id,
  };
  const response = await cancelAppointedHelper(data_model);
  res.send(response);
});

// get applied tasks
tasksRoute.post("/get_applied_tasks", async (req: any, res: any) => {
  let inputs = req.body;

  let data_model = {
    helper_id: inputs.helper_id,
  };
  const response = await getAppliedTasks(data_model);
  res.send(response);
});

// get applied tasks
tasksRoute.post("/get_assigned_tasks", async (req: any, res: any) => {
  let inputs = req.body;

  let data_model = {
    helper_id: inputs.helper_id,
  };
  const response = await getAssignedTasks(data_model);
  res.send(response);
});
