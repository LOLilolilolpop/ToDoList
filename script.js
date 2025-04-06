const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("item4");

// Fetch and display tasks on page load
window.onload = fetchTasks;

function fetchTasks() {
  fetch("http://localhost:3000/tasks")
    .then((response) => response.json())
    .then((data) => {
      displayTasks(data.tasks);
    })
    .catch((error) => console.error("Error fetching tasks:", error));
}

function displayTasks(tasks) {
  taskList.innerHTML = ""; // Clear previous tasks

  tasks.forEach((task, index) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    // Task Text
    const taskText = document.createElement("span");
    taskText.classList.add("task-text");
    taskText.textContent = task;

    // Buttons Container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("task-buttons");

    // Edit Button
    const editButton = document.createElement("button");
    editButton.textContent = "✏️";
    editButton.classList.add("edit-btn");
    editButton.onclick = () => editTask(index);

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = () => deleteTask(index);

    // Append buttons to container
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    // Append task text and buttons to task element
    taskElement.appendChild(taskText);
    taskElement.appendChild(buttonsContainer);

    // Append task to task list
    taskList.appendChild(taskElement);
  });
}

function addTask() {
  const task = taskInput.value.trim();

  if (!task) {
    alert("Please enter a task.");
    return;
  }

  fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  })
    .then((response) => response.json())
    .then((data) => {
      taskInput.value = ""; // Clear input field
      displayTasks(data.tasks);
    })
    .catch((error) => console.error("Error adding task:", error));
}

function deleteTask(index) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  fetch(`http://localhost:3000/tasks/${index}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      displayTasks(data.tasks);
    })
    .catch((error) => console.error("Error deleting task:", error));
}

function editTask(index) {
  let newTask = prompt("Edit your task:");

  if (newTask === null || newTask.trim() === "") return;

  fetch(`http://localhost:3000/tasks/${index}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: newTask }),
  })
    .then((response) => response.json())
    .then((data) => {
      displayTasks(data.tasks);
    })
    .catch((error) => console.error("Error editing task:", error));
}

addButton.addEventListener("click", addTask);
