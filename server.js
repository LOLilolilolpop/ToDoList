const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const filePath = "task.txt";

// Function to read tasks from file
function readTasks() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf8");
  return data ? data.split("\n").filter((task) => task.trim() !== "") : [];
}

// Function to save tasks to file
function saveTasks(tasks) {
  fs.writeFileSync(filePath, tasks.join("\n"), "utf8");
}

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json({ tasks: readTasks() });
});

// Add a new task
app.post("/tasks", (req, res) => {
  let tasks = readTasks();
  tasks.push(req.body.task);
  saveTasks(tasks);
  res.json({ success: true, tasks });
});

// Delete a task
app.delete("/tasks/:index", (req, res) => {
  let tasks = readTasks();
  const index = parseInt(req.params.index);

  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    saveTasks(tasks);
    res.json({ success: true, tasks });
  } else {
    res.status(400).json({ success: false, message: "Invalid index" });
  }
});

// Edit a task
app.put("/tasks/:index", (req, res) => {
  let tasks = readTasks();
  const index = parseInt(req.params.index);

  if (index >= 0 && index < tasks.length) {
    tasks[index] = req.body.task;
    saveTasks(tasks);
    res.json({ success: true, tasks });
  } else {
    res.status(400).json({ success: false, message: "Invalid index" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
