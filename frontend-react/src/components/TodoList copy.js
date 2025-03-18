import React, { useState, useEffect } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../api/todoApi";
import { loginUser, registerUser } from "../api/todoApi"; // Import auth functions
import { useNavigate } from "react-router-dom"; // Ensure redirection after login
import "../styles/TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    Title: "",
    Description: "",
    TodoStatus: "pending",
  });

  const [user, setUser] = useState(null); // Track logged-in user
  const [authData, setAuthData] = useState({ identifier: "", password: "" }); // Login form state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // For redirection

  useEffect(() => {
    fetchTodosList();
  }, []);

  const fetchTodosList = async () => {
    const data = await fetchTodos();
    setTodos(data);
  };

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const userData = await loginUser(authData);
    if (userData) {
      setUser(userData.user);
      localStorage.setItem("token", userData.jwt);
      localStorage.setItem("user", JSON.stringify(userData.user));
      setAuthData({ identifier: "", password: "" }); // Clear form
      navigate("/"); // Redirect to home after login
    } else {
      alert("Login failed. Please check credentials.");
    }
  };

  // ✅ Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const newUser = await registerUser(registerData);
    if (newUser) {
      setUser(newUser.user);
      localStorage.setItem("token", newUser.jwt);
      localStorage.setItem("user", JSON.stringify(newUser.user));
      setRegisterData({ username: "", email: "", password: "" }); // Clear form
      navigate("/");
    } else {
      alert("Registration failed.");
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login page
  };

  // ✅ Handle Adding a Todo
  const handleAddTodo = async () => {
    if (!newTodo.Title.trim()) return;
    await addTodo(newTodo);
    setNewTodo({ Title: "", Description: "", TodoStatus: "pending" });
    fetchTodosList();
  };

  // ✅ Handle Updating Todo Status
  const handleUpdateStatus = async (documentId, newStatus) => {
    await updateTodo(documentId, { TodoStatus: newStatus });
    fetchTodosList();
  };

  // ✅ Handle Deleting a Todo
  const handleDeleteTodo = async (documentId) => {
    await deleteTodo(documentId);
    fetchTodosList();
  };

  return (
    <div className="todo-container">
      <h2>📝 Todo List</h2>

      {/* ✅ Authenticated User View */}
      {user ? (
        <>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          <div className="todo-input">
            <input
              type="text"
              value={newTodo.Title}
              onChange={(e) => setNewTodo({ ...newTodo, Title: e.target.value })}
              placeholder="Add a new task..."
            />
            <button onClick={handleAddTodo}>Add</button>
          </div>

          <div className="todo-list">
            {todos.map((todo) => (
              <div key={todo.id} className="todo-card">
                <div className="todo-header">
                  <h3>{todo.Title}</h3>
                  <span className={`status-badge ${todo.TodoStatus}`}>
                    {todo.TodoStatus}
                  </span>
                </div>
                <p>{todo.Description || "No description provided."}</p>

                <div className="todo-actions">
                  <select
                    value={todo.TodoStatus}
                    onChange={(e) => handleUpdateStatus(todo.documentId, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button onClick={() => handleDeleteTodo(todo.documentId)}>🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // ✅ Guest View (Login/Register)
        <div className="guest-view">
          <p>Please <strong>Login or Register</strong> to manage tasks.</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={authData.identifier}
              onChange={(e) => setAuthData({ ...authData, identifier: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            />
            <button type="submit">Login</button>
          </form>

          <h3>New User? Register below:</h3>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <button type="submit">Register</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TodoList;
