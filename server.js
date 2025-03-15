const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "task_management",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the server if DB fails
  }
  console.log("Connected to MySQL");
});

// Handle form submission from index.html
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

  const sql =
    "INSERT INTO tasks (task_owner, task_name, description, start_date, due_date, reminder, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

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
        console.error("MySQL Insert Error: ", err);
        return res.json({ success: false, message: err.message });
      }
      res.json({ success: true });
    }
  );
});

// Fetch tasks for task-details.html
app.get("/get-tasks", (req, res) => {
  const sql = "SELECT * FROM tasks";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.json([]);
    }
    res.json(results);
  });
});

app.use(express.static("public"));

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
