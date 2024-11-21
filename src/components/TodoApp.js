import { useState, useEffect } from "react";
import "../styles/styles.css";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  //fetch tasks from todo-backend app
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks");
      const tasks = await response.json();
      setTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks from backend:", error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (newTask.trim() === "") return;
    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTask, completed: false }),
      });
      if (response.ok) {
        fetchTasks();
        setNewTask("");
      }
    } catch (error) {
      console.error("Error adding new task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Update a task (toggle completed)
  const toggleTask = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span className={task.completed ? "completed" : ""}>
              {task.text}
            </span>
            <button
              aria-label={`Mark task ${task.text} as ${task.completed ? "not completed" : "completed"}`}
              onClick={() => toggleTask(task.id, task.completed)}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>{" "}
            <button
              aria-label={`Delete task ${task.text}`}
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
