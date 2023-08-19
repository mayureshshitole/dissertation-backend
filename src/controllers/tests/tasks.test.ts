// import {
//   createTask,
//   getUserTask,
//   singleTaskDetails,
//   deleteTask,
//   getAppliedTasks,
//   getAssignedTasks,
// } from "../tasks";

// describe("Task Controller Tests", () => {
//   beforeAll(() => {
//     // Establish database connection or setup mock
//     //   connectionDB.connect();
//     console.log("Started");
//   });

//   afterAll(() => {
//     // Close database connection
//     //   connectionDB.end();
//     console.log("Ended");
//   });

//   test("createTask should insert a new task", async () => {
//     const taskInput = {
//       title: "Test Task",
//       user_id: 15,
//       deadline: "Thu Jul 20 2023 22:51:03 GMT+0100 (British Summer Time)",
//       budget: 10,
//       description: "efghijklmnop",
//       latitude: "51.8815744",
//       longitude: "0.9469952",
//     };

//     const result = await createTask(taskInput);
//     expect(result.affectedRows).toBe(1);
//   });

//   test("getUserTask should retrieve tasks for a user", async () => {
//     const user_id = 15;

//     const tasks = await getUserTask(user_id);
//     expect(Array.isArray(tasks)).toBe(true);
//   });

//   test("singleTaskDetails should retrieve details of a single task with bids", async () => {
//     const taskID = 19;

//     const taskDetails = await singleTaskDetails(taskID);
//     expect(taskDetails).toHaveProperty("bids_list");
//   });

//   test("taskDetails should retrieve task details for a user", async () => {
//     const inputs = {
//       user_id: 15,
//       task_id: 19,
//     };

//     const taskDetails = await taskDetails(inputs);
//     expect(taskDetails.length).toBe(1);
//   });

//   test("deleteTask should mark a task as closed", async () => {
//     const taskID = 1;

//     const result = await deleteTask(taskID);
//     expect(result.affectedRows).toBe(1);
//   });

//   // Add more tests for other functions...

//   test("getAppliedTasks should retrieve tasks that a helper has applied to", async () => {
//     const inputs = {
//       helper_id: 15,
//     };

//     const appliedTasks = await getAppliedTasks(inputs);
//     expect(Array.isArray(appliedTasks)).toBe(true);
//   });

//   test("getAssignedTasks should retrieve tasks that a helper has been assigned to", async () => {
//     const inputs = {
//       helper_id: 15,
//     };

//     const assignedTasks = await getAssignedTasks(inputs);
//     expect(Array.isArray(assignedTasks)).toBe(true);
//   });
// });
