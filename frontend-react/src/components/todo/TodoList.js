import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../../api/todoApi";
import TodoForm from "./TodoForm";
import TodoTable from "./TodoTable";
import UserHeader from "./UserHeader";
import "../../styles/TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    status: "PENDING",
    priority: "MEDIUM",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodosList();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchTodosList = async () => {
    const data = await fetchTodos();
    setTodos(data);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAddTodo = async () => {
    setErrors({});
    const today = new Date().toISOString().split("T")[0];

    if (!newTodo.title.trim()) {
      setErrors({ title: "Task title is required" });
      return;
    }

    if (newTodo.dueDate && newTodo.dueDate < today) {
      setErrors({ dueDate: "Due date cannot be in the past" });
      return;
    }

    try {
      await addTodo(newTodo);
      setNewTodo({
        title: "",
        description: "",
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: "",
      });
      fetchTodosList();
    } catch (error) {
      if (error?.error?.details?.errors) {
        const errorMessages = {};
        error.error.details.errors.forEach(err => {
          errorMessages[err.path[0]] = err.message;
        });
        setErrors(errorMessages);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    await updateTodo(id, updates);
    fetchTodosList();
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    fetchTodosList();
  };

  if (!user) {
    return (
      <div className="container">
        <div className="right-section">
          <h2>Start organizing for free</h2>
          <p>Please login to manage your todos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="right-section">
        <UserHeader user={user} handleLogout={handleLogout} />
        <TodoForm
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          handleAddTodo={handleAddTodo}
          errors={errors}
        />
        <TodoTable
          todos={todos}
          onUpdateTodo={handleUpdateTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      </div>
    </div>
  );
};

export default TodoList; 