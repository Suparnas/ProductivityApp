import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/todoApi";
import "../styles/auth.css"; // Importing from styles folder

const Register = () => {
  const [userDetails, setUserDetails] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await registerUser(userDetails);
    if (response?.jwt) {
      localStorage.setItem("authToken", response.jwt);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/");
    } else {
      setError("Registration failed! Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <input type="text" name="username" placeholder="Username" value={userDetails.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={userDetails.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={userDetails.password} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Register;
