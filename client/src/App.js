import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AvailabilityCalendar from './pages/AvailabilityCalendar';
import SearchResults from './pages/SearchResults';
import BookingPage from './pages/BookingPage';
import MyReservations from './pages/MyReservations';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/Navbar';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/book/:roomId" element={<BookingPage />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/calendar" element={<AvailabilityCalendar />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;