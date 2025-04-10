import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TodoPage from './pages/TodoPage';
import Sidebar from './components/layout/Sidebar';
import LandingPage from './pages/LandingPage';
import './styles/App.css';
import './styles/theme.css';  // Import our new theme

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="app-container" style={{ background: '#4338CA', padding: 0, margin: 0, border: 'none', width: '100%' }}>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container" style={{ background: '#4338CA', padding: 0, margin: 0, border: 'none', width: '100%' }}>
        <div className={`app-content ${!isAuthenticated ? 'no-sidebar' : ''}`} style={{ padding: 0, margin: 0, border: 'none' }}>
          {isAuthenticated && (
            <Sidebar setIsAuthenticated={setIsAuthenticated} />
          )}
          <main className="main-content" style={{ 
            background: '#4338CA', 
            border: 'none',
            marginLeft: isAuthenticated ? '250px' : '0',
            width: isAuthenticated ? 'calc(100% - 250px)' : '100%'
          }}>
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <TodoPage />
                  ) : (
                    <LandingPage />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <Login setIsAuthenticated={setIsAuthenticated} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  !isAuthenticated ? (
                    <Register setIsAuthenticated={setIsAuthenticated} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
