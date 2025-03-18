// src/components/TodoListContainer.js
import React, { useState, useEffect } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../api/todoApi";
import { loginUser, registerUser } from "../api/todoApi";
import { useNavigate } from "react-router-dom";
import TodoInput from "./TodoInput";
import TodoItem from "./TodoItem";
import LoginForm from "./_LoginForm";
import RegisterForm from "./RegisterForm";
import UserHeader from "./UserHeader";
import IllustrationSection from "./IllustrationSection";
import "../styles/TodoList.css";

const TodoListContainer = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ Title: "", Description: "", TodoStatus: "pending" });
  const [user, setUser] = useState(null);
  const [authData, setAuthData] = useState({ identifier: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodosList();
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchTodosList = async () => {
    const data = await fetchTodos();
    setTodos(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const userData = await loginUser(authData);
    if (userData) {
      setUser(userData.user);
      localStorage.setItem("token", userData.jwt);
      localStorage.setItem("user", JSON.stringify(userData.user));
      setAuthData({ identifier: "", password: "" });
      navigate("/");
    } else {
      alert("Login failed. Please check credentials.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newUser = await registerUser(registerData);
    if (newUser) {
      setUser(newUser.user);
      localStorage.setItem("token", newUser.jwt);
      localStorage.setItem("user", JSON.stringify(newUser.user));
      setRegisterData({ username: "", email: "", password: "" });
      navigate("/");
    } else {
      alert("Registration failed.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAddTodo = async () => {
    if (!newTodo.Title.trim()) return;
    await addTodo(newTodo);
    setNewTodo({ Title: "", Description: "", TodoStatus: "pending" });
    fetchTodosList();
  };

  const handleUpdateStatus = async (id, status) => {
    await updateTodo(id, { TodoStatus: status });
    fetchTodosList();
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    fetchTodosList();
  };

  return (
    <div className="container">
      <IllustrationSection />
      <div className="right-section">
        {user ? (
          <>
            <UserHeader user={user} onLogout={handleLogout} />
            <TodoInput newTodo={newTodo} setNewTodo={setNewTodo} onAdd={handleAddTodo} />
            <ul className="todo-list">
              {todos.map((todo) => (
                <TodoItem key={todo._id} todo={todo} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteTodo} />
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2>Start organizing for free</h2>
            <p>Enjoy 7 days of premium features. Cancel anytime.</p>
            <LoginForm authData={authData} setAuthData={setAuthData} onLogin={handleLogin} />
            <p className="or-text">or register</p>
            <RegisterForm registerData={registerData} setRegisterData={setRegisterData} onRegister={handleRegister} />
          </>
        )}
      </div>
    </div>
  );
};

export default TodoListContainer;
