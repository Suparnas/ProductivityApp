// src/components/LoginForm.js
import React from "react";

const LoginForm = ({ authData, setAuthData, onLogin }) => {
  return (
    <form className="auth-form" onSubmit={onLogin}>
      <input
        type="text"
        placeholder="Username or Email"
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
  );
};

export default LoginForm;
