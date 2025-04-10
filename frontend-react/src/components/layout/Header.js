import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchCurrentUser } from '../../api/todoApi';
import '../../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userData = await fetchCurrentUser();
          if (userData) {
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            // If we can't fetch user data, clear the invalid token
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-link">
              <h1>Todo App</h1>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1>Todo App</h1>
          </Link>
        </div>
        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <span className="user-welcome">Welcome, {user?.username || 'User'}!</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 