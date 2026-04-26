import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ✅ Yeh sahi hai
import AuthContext from "../context/AuthContext";
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🎯</span>
          FairLens AI
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/analyze">Analyze</Link>
              <Link to="/dashboard">Dashboard</Link>
              <span className="user-info">{user.name}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/register" className="register-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
