import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getRoomById, createReservation } from '../services/api';
import './BookingPage.css';

function BookingPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const checkIn = params.get('checkIn');
  const checkOut = params.get('checkOut');
  const guests = params.get('guests');
  const totalPrice = params.get('totalPrice');
  const basePrice = params.get('basePrice');
  const nights = params.get('nights');

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ guestName: '', guestEmail: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomById(roomId);
        setRoom(res.data);
      } catch (err) {
        setError('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.guestName || !form.guestEmail) return setError('Please fill in all fields');
    if (!form.guestEmail.includes('@')) return setError('Please enter a valid email');
    try {
      setSubmitting(true);
      setError('');
      const res = await createReservation({
        room: roomId,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        checkIn,
        checkOut,
        guests: parseInt(guests),
        totalPrice: parseFloat(totalPrice)
      });
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading room details...</div>;

  if (success) return (
    <div className="booking-success">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h2>Booking Confirmed!</h2>
        <p>Thank you, <strong>{success.guestName}</strong>!</p>
        <div className="booking-ref">Booking Ref: <span>{success.bookingRef}</span></div>
        <div className="success-details">
          <p>📅 Check-in: {new Date(success.checkIn).toDateString()}</p>
          <p>📅 Check-out: {new Date(success.checkOut).toDateString()}</p>
          <p>💰 Total Paid: ${success.totalPrice}</p>
          <p>📧 Confirmation sent to: {success.guestEmail}</p>
        </div>
        <div className="success-buttons">
          <button onClick={() => navigate('/my-reservations')}>View My Reservations</button>
          <button className="outline" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-form">
          <h2>Complete Your Booking</h2>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="guestName"
              placeholder="Enter your full name"
              value={form.guestName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="guestEmail"
              placeholder="Enter your email"
              value={form.guestEmail}
              onChange={handleChange}
            />
          </div>
          <button
            className="confirm-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </div>
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-card">
            <div className="summary-room">🏨 {room?.name}</div>
            <div className="summary-type">{room?.type}</div>
            <hr />
            <div className="summary-row">
              <span>Check-in</span>
              <span>{new Date(checkIn).toDateString()}</span>
            </div>
            <div className="summary-row">
              <span>Check-out</span>
              <span>{new Date(checkOut).toDateString()}</span>
            </div>
            <div className="summary-row">
              <span>Guests</span>
              <span>{guests}</span>
            </div>
            <div className="summary-row">
              <span>Nights</span>
              <span>{nights}</span>
            </div>
            <div className="summary-row">
              <span>Price per night</span>
              <span>${basePrice}</span>
            </div>
            <hr />
            <div className="summary-total">
              <span>Total</span>
              <span>${parseFloat(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;