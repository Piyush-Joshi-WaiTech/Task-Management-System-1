document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/get-tasks")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("taskContainer");
      container.innerHTML = "";

      data.forEach((task) => {
        const taskRow = document.createElement("div");
        taskRow.className =
          "task-row d-flex align-items-center justify-content-between p-3 border-bottom";

        const isCompleted = task.status.toLowerCase() === "completed";
        const profileInitial = task.task_owner.charAt(0).toUpperCase();
        const formattedDate = new Date(task.start_date).toLocaleDateString();

        taskRow.innerHTML = `
          <div class="d-flex align-items-center">
            <input type="checkbox" class="form-check-input me-3" ${
              isCompleted ? "checked" : ""
            }>
            <div class="avatar bg-pink text-white rounded-circle d-flex align-items-center justify-content-center me-3">
              ${profileInitial}
            </div>
            <div>
              <div class="fw-bold">${task.task_name}</div>
              <small>${task.id} - ${task.task_owner} • ${formattedDate}</small>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-warning" onclick="updateTask(${
              task.id
            })">Update</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTask(${
              task.id
            })">Delete</button>
          </div>
        `;
        container.appendChild(taskRow);
      });
    })
    .catch((error) => console.error("Error fetching tasks:", error));
});

// Placeholder functions for update/delete actions
let currentUpdateTaskId = null; // Store the task ID for updating

function updateTask(id) {
  // Fetch the specific task data by ID
  fetch(`http://localhost:3000/get-task/${id}`)
    .then((res) => res.json())
    .then((task) => {
      currentUpdateTaskId = id;

      // Populate modal fields
      document.getElementById("update_task_id").value = task.id;
      document.getElementById("update_task_owner").value = task.task_owner;
      document.getElementById("update_task_name").value = task.task_name;
      document.getElementById("update_description").value = task.description;
      document.getElementById("update_start_date").value =
        task.start_date.split("T")[0];
      document.getElementById("update_due_date").value =
        task.due_date.split("T")[0];
      document.getElementById("update_reminder").value = task.reminder;
      document.getElementById("update_priority").value = task.priority;
      document.getElementById("update_status").value = task.status;

      // Show modal
      const updateModal = new bootstrap.Modal(
        document.getElementById("updateModal")
      );
      updateModal.show();
    })
    .catch((error) => console.error("Error fetching task for update:", error));
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    fetch(`http://localhost:3000/delete-task/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          location.reload(); // Refresh the task list
        } else {
          alert("Failed to delete the task.");
        }
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  }
}

// ✅ Update Task Form Submission Handler
document
  .getElementById("updateTaskForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from reloading page

    const id = document.getElementById("update_task_id").value;
    const updatedTask = {
      task_owner: document.getElementById("update_task_owner").value,
      task_name: document.getElementById("update_task_name").value,
      description: document.getElementById("update_description").value,
      start_date: document.getElementById("update_start_date").value,
      due_date: document.getElementById("update_due_date").value,
      reminder: document.getElementById("update_reminder").value,
      priority: document.getElementById("update_priority").value,
      status: document.getElementById("update_status").value,
    };

    fetch(`http://localhost:3000/update-task/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Close modal and reload task list
          const updateModalEl = document.getElementById("updateModal");
          const updateModal = bootstrap.Modal.getInstance(updateModalEl);
          updateModal.hide();
          location.reload(); // Refresh to show updated task
        } else {
          alert("Failed to update task.");
        }
      })
      .catch((error) => console.error("Error updating task:", error));
  });
