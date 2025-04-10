import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckSquare, FiClock, FiUsers } from 'react-icons/fi';
import laptopImage from '../assets/images/laptop-work.jpg';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          Taskie
        </Link>
        <div className="landing-nav-right">
          <Link to="/login" className="landing-nav-link">
            Log In
          </Link>
          <Link to="/register" className="landing-nav-button">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="landing-hero">
        <div className="landing-content">
          <h1 className="landing-title">
            Organize Your Work & Life
          </h1>
          <p className="landing-description">
            Stay on top of your tasks, deadlines, and goals with Taskie. 
            Simple, intuitive, and designed for productivity.
          </p>
          <div className="landing-cta">
            <Link to="/register" className="landing-button landing-button-primary">
              Start organizing for free
            </Link>
            <Link to="/login" className="landing-button landing-button-secondary">
              Already have an account?
            </Link>
          </div>
        </div>
        <div className="landing-image-container">
          <img 
            src={laptopImage}
            alt="Person working on laptop"
            className="landing-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.parentElement.style.minHeight = '300px';
              e.target.parentElement.style.borderRadius = '16px';
            }}
          />
        </div>
      </main>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FiCheckSquare size={28} />
            </div>
            <h3 className="feature-title">Simple & Intuitive</h3>
            <p className="feature-description">
              Easy to use interface that helps you focus on what matters most
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiClock size={28} />
            </div>
            <h3 className="feature-title">Stay Organized</h3>
            <p className="feature-description">
              Keep track of tasks, deadlines, and priorities in one place
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiUsers size={28} />
            </div>
            <h3 className="feature-title">Boost Productivity</h3>
            <p className="feature-description">
              Achieve more with smart task management and collaboration
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 