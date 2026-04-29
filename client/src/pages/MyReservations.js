import React, { useState } from 'react';
import { getReservationsByEmail, cancelReservation, modifyReservation } from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './MyReservations.css';

function MyReservations() {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [modifying, setModifying] = useState(null);
  const [newCheckIn, setNewCheckIn] = useState(null);
  const [newCheckOut, setNewCheckOut] = useState(null);

  const handleSearch = async () => {
    if (!email.includes('@')) return setError('Please enter a valid email');
    try {
      setLoading(true);
      setError('');
      const res = await getReservationsByEmail(email);
      setReservations(res.data);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await cancelReservation(id);
      setReservations(reservations.map(r =>
        r._id === id ? { ...r, status: 'cancelled' } : r
      ));
    } catch (err) {
      alert('Failed to cancel reservation');
    }
  };

  const handleModify = async (id) => {
    if (!newCheckIn || !newCheckOut) return alert('Please select new dates');
    if (newCheckOut <= newCheckIn) return alert('Check-out must be after check-in');
    try {
      const res = await modifyReservation(id, {
        checkIn: newCheckIn.toISOString(),
        checkOut: newCheckOut.toISOString()
      });
      setReservations(reservations.map(r => r._id === id ? res.data : r));
      setModifying(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to modify reservation');
    }
  };

  const statusColor = (status) => {
    if (status === 'confirmed') return '#2ecc71';
    if (status === 'cancelled') return '#e74c3c';
    if (status === 'modified') return '#f39c12';
    return '#999';
  };

  return (
    <div className="my-reservations">
      <h2>My Reservations</h2>
      <div className="email-search">
        <input
          type="email"
          placeholder="Enter your email to find reservations"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Find Reservations'}
        </button>
      </div>
      {error && <div className="error-msg">{error}</div>}
      {searched && reservations.length === 0 && (
        <div className="no-results">No reservations found for this email.</div>
      )}
      <div className="reservations-list">
        {reservations.map(r => (
          <div className="reservation-card" key={r._id}>
            <div className="res-header">
              <div>
                <h3>{r.room?.name || 'Room'}</h3>
                <span className="res-ref">Ref: {r.bookingRef}</span>
              </div>
              <span className="res-status" style={{ color: statusColor(r.status) }}>
                ● {r.status.toUpperCase()}
              </span>
            </div>
            <div className="res-details">
              <p>📅 Check-in: {new Date(r.checkIn).toDateString()}</p>
              <p>📅 Check-out: {new Date(r.checkOut).toDateString()}</p>
              <p>👥 Guests: {r.guests}</p>
              <p>💰 Total: ${r.totalPrice}</p>
            </div>
            {r.status !== 'cancelled' && (
              <div className="res-actions">
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(r._id)}
                >
                  Cancel
                </button>
                <button
                  className="modify-btn"
                  onClick={() => setModifying(modifying === r._id ? null : r._id)}
                >
                  {modifying === r._id ? 'Close' : 'Modify Dates'}
                </button>
              </div>
            )}
            {modifying === r._id && (
              <div className="modify-form">
                <div className="modify-dates">
                  <div>
                    <label>New Check-in</label>
                    <DatePicker
                      selected={newCheckIn}
                      onChange={date => setNewCheckIn(date)}
                      minDate={new Date()}
                      placeholderText="Select date"
                      className="date-input"
                    />
                  </div>
                  <div>
                    <label>New Check-out</label>
                    <DatePicker
                      selected={newCheckOut}
                      onChange={date => setNewCheckOut(date)}
                      minDate={newCheckIn || new Date()}
                      placeholderText="Select date"
                      className="date-input"
                    />
                  </div>
                </div>
                <button
                  className="confirm-modify-btn"
                  onClick={() => handleModify(r._id)}
                >
                  Confirm New Dates
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyReservations;