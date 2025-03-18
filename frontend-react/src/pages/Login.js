import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/todoApi";
import "../styles/auth.css"; // Importing from styles folder

const Login = () => {
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser(credentials);
    if (response?.jwt) {
      localStorage.setItem("authToken", response.jwt);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/");
    } else {
      setError("Invalid email or password!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="text" name="identifier" placeholder="Email" value={credentials.identifier} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
};

export default Login;
