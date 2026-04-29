import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🏨 StayEase</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/my-reservations">My Reservations</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;