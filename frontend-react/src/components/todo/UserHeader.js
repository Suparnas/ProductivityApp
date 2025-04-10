import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/UserHeader.css';

const UserHeader = ({ user, handleLogout }) => {
  return (
    <div className="user-header">
      <h2>Welcome, {user.username}!</h2>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

UserHeader.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default UserHeader; 