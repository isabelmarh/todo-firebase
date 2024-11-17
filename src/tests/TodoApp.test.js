import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoApp from "../components/TodoApp";
import { collection, getDocs, deleteDoc, doc } from "../firebase/firebase";
import { db } from "../firebase/firebase";

afterEach(async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  for (const task of querySnapshot.docs) {
    const data = task.data();
    if (data.text.startsWith("Test Task") || data.text.startsWith("Task to Delete")) {
      await deleteDoc(doc(db, "tasks", task.id));
    }
  }
});

describe("TodoApp Component", () => {
  test("renders input field and Add Task button", () => {
    render(<TodoApp />);
    expect(screen.getByPlaceholderText("New task")).toBeInTheDocument();
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  test("adds a new task when Add Task button is clicked", async () => {
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("New task");
    const addButton = screen.getByText("Add Task");
    const uniqueTask = `Test Task - ${Date.now()}`; // Generate a unique task name

    fireEvent.change(input, { target: { value: uniqueTask } });
    fireEvent.click(addButton);

    const taskElement = await screen.findByText(uniqueTask);

    expect(taskElement).toBeInTheDocument();
  });

  test("marks a task as completed when Complete button is clicked", async () => {
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("New task");
    const addButton = screen.getByText("Add Task");
    const uniqueTask = `Test Task - ${Date.now()}`; // Unique task name

    fireEvent.change(input, { target: { value: uniqueTask } });
    fireEvent.click(addButton);

    await screen.findByText(uniqueTask);

    const completeButton = screen.getByLabelText(`Mark task ${uniqueTask} as completed`);
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText(uniqueTask)).toHaveClass("completed");
    });
  });

  test("deletes a task when Delete button is clicked", async () => {
    render(<TodoApp />);

    const input = screen.getByPlaceholderText("New task");
    const addButton = screen.getByText("Add Task");
    const uniqueTask = `Task to Delete - ${Date.now()}`;

    fireEvent.change(input, { target: { value: uniqueTask } });
    fireEvent.click(addButton);

    await screen.findByText(uniqueTask);

    const deleteButton = screen.getByLabelText(`Delete task ${uniqueTask}`);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText(uniqueTask)).not.toBeInTheDocument();
    });
  });
});
