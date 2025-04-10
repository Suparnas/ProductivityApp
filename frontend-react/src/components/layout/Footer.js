import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentUser } from '../../api/todoApi';
import '../../styles/Footer.css';

const Footer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = await fetchCurrentUser();
        setIsAuthenticated(!!userData);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Todo App</h3>
          <p>Stay organized and boost your productivity</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            {!isAuthenticated ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            ) : (
              <li><Link to="/">My Todos</Link></li>
            )}
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@todoapp.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Todo App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 