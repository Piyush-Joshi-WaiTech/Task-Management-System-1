document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/get-tasks")
    .then((response) => response.json())
    .then((data) => {
      const taskTableBody = document.getElementById("taskTableBody");
      taskTableBody.innerHTML = "";

      data.forEach((task) => {
        const row = `
                    <tr>
                        <td>${task.task_owner}</td>
                        <td>${task.task_name}</td>
                        <td>${task.description}</td>
                        <td>${task.start_date}</td>
                        <td>${task.due_date}</td>
                        <td>${task.reminder}</td>
                        <td>${task.priority}</td>
                        <td>${task.status}</td>
                    </tr>
                `;
        taskTableBody.innerHTML += row;
      });
    })
    .catch((error) => console.error("Error fetching tasks:", error));
});
