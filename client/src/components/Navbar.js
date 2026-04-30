import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🏨 StayEase</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/my-reservations">My Reservations</Link>
        {isAdmin ? (
          <>
            <Link to="/admin">Admin</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/admin-login">Admin</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;