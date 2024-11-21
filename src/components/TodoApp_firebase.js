import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "../styles/styles.css";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  //fetch tasks from firestore
  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasksList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(tasksList);
  };
  // Add a new task
  const addTask = async () => {
    if (newTask.trim() === "") return;
    await addDoc(collection(db, "tasks"), { text: newTask, completed: false });
    setNewTask("");
    fetchTasks();
  };

  // Delete a task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks();
  };

  // Update a task (toggle completed)
  const toggleTask = async (id, completed) => {
    await updateDoc(doc(db, "tasks", id), { completed: !completed });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New task" />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span className={task.completed ? "completed" : ""}>{task.text}</span>
            <button aria-label={`Mark task ${task.text} as ${task.completed ? "not completed" : "completed"}`} onClick={() => toggleTask(task.id, task.completed)}>
              {task.completed ? "Undo" : "Complete"}
            </button>{" "}
            <button aria-label={`Delete task ${task.text}`} onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
