import React, { useState, useEffect } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo, loginUser, registerUser } from "../api/todoApi";
import { useNavigate } from "react-router-dom";
import "../styles/TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    Title: "",
    Description: "",
    TodoStatus: "pending",
    Priority: "medium",
    DueDate: "",
  });

  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [authData, setAuthData] = useState({ identifier: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });

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
    setErrors({});

    const today = new Date().toISOString().split("T")[0]; // Define today here

    if (!newTodo.Title.trim()) {
      setErrors({ Title: "Task title is required" });
      return;
    }

    if (newTodo.DueDate < today) {
      setErrors({ DueDate: "Due date cannot be in the past" });
      return;
    }

    try {
      await addTodo(newTodo);
      setNewTodo({ Title: "", Description: "", TodoStatus: "pending", Priority: "medium", DueDate: "" });
      fetchTodosList();
    } catch (error) {
      if (error && error.error && error.error.details && error.error.details.errors) {
        // Strapi validation error format
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

  const handleUpdateStatus = async (documentId, newStatus) => {
    await updateTodo(documentId, { TodoStatus: newStatus });
    fetchTodosList();
  };

  const handleUpdatePriority = async (documentId, newPriority) => {
    await updateTodo(documentId, { Priority: newPriority });
    fetchTodosList();
  };

  const handleUpdateDueDate = async (documentId, newDate) => {
    await updateTodo(documentId, { DueDate: newDate });
    fetchTodosList();
  };

  const handleDeleteTodo = async (documentId) => {
    await deleteTodo(documentId);
    fetchTodosList();
  };

  return (
    <div className="container">
      <div className="right-section">
        {user ? (
          <>
            <h2>Welcome, {user.username}!</h2>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>

            <div className="todo-input">
              <input
                type="text"
                placeholder="Task title..."
                value={newTodo.Title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, Title: e.target.value })
                }
              />
              {errors.Title && <p className="error-message">{errors.Title}</p>}

              <input
                type="text"
                placeholder="Description..."
                value={newTodo.Description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, Description: e.target.value })
                }
              />
              {errors.Description && (
                <p className="error-message">{errors.Description}</p>
              )}

              <select
                value={newTodo.Priority}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, Priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.Priority && (
                <p className="error-message">{errors.Priority}</p>
              )}

              <input
                type="date"
                value={newTodo.DueDate}
                min={new Date().toISOString().split("T")[0]} // This prevents past dates
                onChange={(e) =>
                  setNewTodo({ ...newTodo, DueDate: e.target.value })
                }
              />
              {errors.DueDate && (
                <p className="error-message">{errors.DueDate}</p>
              )}

              <button onClick={handleAddTodo}>Add</button>
              {errors.general && (
                <p className="error-message">{errors.general}</p>
              )}
            </div>

            <table className="todo-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo) => (
                  <tr key={todo.documentId} className={todo.TodoStatus}>
                    <td>{todo.Title}</td>
                    <td>{todo.Description || "No description"}</td>
                    <td>
                      <select
                        value={todo.TodoStatus}
                        onChange={(e) =>
                          handleUpdateStatus(todo.documentId, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={todo.Priority}
                        onChange={(e) =>
                          handleUpdatePriority(todo.documentId, e.target.value)
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        value={todo.DueDate}
                        onChange={(e) =>
                          handleUpdateDueDate(todo.documentId, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button onClick={() => handleDeleteTodo(todo.documentId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h2>Start organizing for free</h2>
            <p>Enjoy 7 days of premium features. Cancel anytime.</p>

            <form className="auth-form" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username or Email"
                value={authData.identifier}
                onChange={(e) =>
                  setAuthData({ ...authData, identifier: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={authData.password}
                onChange={(e) =>
                  setAuthData({ ...authData, password: e.target.value })
                }
              />
              <button type="submit">Login</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoList;
