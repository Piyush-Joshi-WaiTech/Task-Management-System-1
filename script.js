// Helper to collect form data
function getFormData() {
  return {
    task_owner: document.getElementById("task_owner").value,
    task_name: document.getElementById("task_name").value,
    description: document.getElementById("description").value,
    start_date: document.getElementById("start_date").value,
    due_date: document.getElementById("due_date").value,
    reminder: document.getElementById("reminder").value,
    priority: document.getElementById("priority").value,
    status: document.getElementById("status").value,
  };
}
function submitForm() {
  const taskData = getFormData();

  fetch("http://localhost:3000/add-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  })
    .then(async (response) => {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} - ${text}`);
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message);
      window.location.href = "task-details.html";
    })
    .catch((error) => {
      console.error("Error submitting task:", error.message);
      alert("Failed to submit task");
    });
}

function submitAndResetForm() {
  const taskData = getFormData();

  fetch("http://localhost:3000/add-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  })
    .then(async (response) => {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} - ${text}`);
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message);
      document.getElementById("taskForm").reset();
    })
    .catch((error) => {
      console.error("Error submitting task:", error.message);
      alert("Failed to submit task");
    });
}
