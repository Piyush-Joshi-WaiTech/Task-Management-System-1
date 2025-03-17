const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static files (JS, CSS) from 'public' folder
app.use("/public", express.static(path.join(__dirname, "public")));

// ✅ Serve HTML files at root URLs
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/task-details.html", (req, res) => {
  res.sendFile(path.join(__dirname, "task-details.html"));
});

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "task_management",
});

// ✅ POST route to add task
app.post("/add-task", (req, res) => {
  const {
    task_owner,
    task_name,
    description,
    start_date,
    due_date,
    reminder,
    priority,
    status,
  } = req.body;

  const sql = `INSERT INTO tasks (task_owner, task_name, description, start_date, due_date, reminder, priority, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      task_owner,
      task_name,
      description,
      start_date,
      due_date,
      reminder,
      priority,
      status,
    ],
    (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ message: "Error adding task" });
      }
      res
        .status(200)
        .json({ message: "Task added successfully", taskId: result.insertId });
    }
  );
});

// ✅ GET all tasks
app.get("/get-tasks", (req, res) => {
  const sql = "SELECT * FROM tasks ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ GET single task by ID
app.get("/get-task/:id", (req, res) => {
  const taskId = req.params.id;

  const sql = "SELECT * FROM tasks WHERE id = ?";
  db.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error("Error fetching task:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(result[0]);
  });
});

// ✅ UPDATE task
app.put("/update-task/:id", (req, res) => {
  const taskId = req.params.id;
  const {
    task_owner,
    task_name,
    description,
    start_date,
    due_date,
    reminder,
    priority,
    status,
  } = req.body;

  const reminderValue = reminder === "" ? null : reminder;
  const priorityValue = priority === "" ? null : priority;

  const sql =
    "UPDATE tasks SET task_owner = ?, task_name = ?, description = ?, start_date = ?, due_date = ?, reminder = ?, priority = ?, status = ? WHERE id = ?";

  db.query(
    sql,
    [
      task_owner,
      task_name,
      description,
      start_date,
      due_date,
      reminderValue,
      priorityValue,
      status,
      taskId,
    ],
    (err, result) => {
      if (err) {
        console.error("Update Error:", err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// ✅ DELETE task and reset AUTO_INCREMENT
app.delete("/delete-task/:id", (req, res) => {
  const taskId = req.params.id;

  const deleteSql = "DELETE FROM tasks WHERE id = ?";
  db.query(deleteSql, [taskId], (err, result) => {
    if (err) {
      console.error("Delete Error:", err);
      return res.status(500).json({ success: false });
    }

    const maxIdSql = "SELECT MAX(id) AS max_id FROM tasks";
    db.query(maxIdSql, (err, results) => {
      if (err) {
        console.error("Max ID Error:", err);
        return res.status(500).json({ success: false });
      }

      const maxId = results[0].max_id || 0;
      const nextId = maxId + 1;

      const resetSql = `ALTER TABLE tasks AUTO_INCREMENT = ${nextId}`;
      db.query(resetSql, (err) => {
        if (err) {
          console.error("Reset AUTO_INCREMENT Error:", err);
          return res.status(500).json({ success: false });
        }

        res.status(200).json({ success: true });
      });
    });
  });
});

// ✅ DELETE ALL TASKS and RESET ID to 1
app.delete("/delete-all-tasks", (req, res) => {
  const deleteSql = "DELETE FROM tasks";
  db.query(deleteSql, (err) => {
    if (err) {
      console.error("Delete All Tasks Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete all tasks" });
    }

    const resetSql = "ALTER TABLE tasks AUTO_INCREMENT = 1";
    db.query(resetSql, (err) => {
      if (err) {
        console.error("Reset AUTO_INCREMENT Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to reset AUTO_INCREMENT" });
      }

      res.status(200).json({
        success: true,
        message: "All tasks deleted and ID reset to 1",
      });
    });
  });
});

// ✅ Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
