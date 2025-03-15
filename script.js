document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const taskData = {
    task_owner: document.getElementById("task_owner").value,
    task_name: document.getElementById("task_name").value,
    description: document.getElementById("description").value,
    start_date: document.getElementById("start_date").value,
    due_date: document.getElementById("due_date").value,
    reminder: document.getElementById("reminder").value,
    priority: document.getElementById("priority").value,
    status: document.getElementById("status").value,
  };

  fetch("http://localhost:3000/add-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.location.href = "task-details.html"; // Redirect on success
      } else {
        alert("Error adding task. Please try again.");
      }
    })
    .catch((error) => console.error("Error:", error));
});
