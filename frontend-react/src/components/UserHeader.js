// src/components/UserHeader.js
import React from "react";

const UserHeader = ({ user, onLogout }) => {
  return (
    <div className="user-header">
      <h2>Welcome, {user.username}!</h2>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default UserHeader;
