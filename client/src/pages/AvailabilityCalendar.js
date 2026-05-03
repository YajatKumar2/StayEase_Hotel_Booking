import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getAllRooms } from '../services/api';
import axios from 'axios';
import './AvailabilityCalendar.css';

function AvailabilityCalendar() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllRooms().then(res => setRooms(res.data));
  }, []);

  useEffect(() => {
    if (!selectedRoom) return;
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/reservations/room/${selectedRoom}`);
        const dates = [];
        res.data.forEach(r => {
          if (r.status === 'cancelled') return;
          let current = new Date(r.checkIn);
          const end = new Date(r.checkOut);
          while (current < end) {
            dates.push(new Date(current).toDateString());
            current.setDate(current.getDate() + 1);
          }
        });
        setBookedDates(dates);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [selectedRoom]);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (bookedDates.includes(date.toDateString())) return 'booked-date';
      if (date >= new Date()) return 'available-date';
    }
    return null;
  };

  const tileDisabled = ({ date }) => date < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="availability-calendar">
      <div className="calendar-header">
        <h2>Room Availability Calendar</h2>
        <p>Select a room to view its availability</p>
      </div>
      <div className="calendar-container">
        <div className="room-selector">
          <h3>Select Room</h3>
          <div className="room-buttons">
            {rooms.map(room => (
              <button
                key={room._id}
                className={`room-btn ${selectedRoom === room._id ? 'active' : ''}`}
                onClick={() => setSelectedRoom(room._id)}
              >
                <span className="room-btn-name">{room.name}</span>
                <span className="room-btn-type">{room.type}</span>
              </button>
            ))}
          </div>
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-dot available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot booked"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>
        <div className="calendar-wrap">
          {!selectedRoom ? (
            <div className="no-room-selected">
              <div className="no-room-icon">🏨</div>
              <h3>Select a room to view availability</h3>
              <p>Choose a room from the list to see which dates are available</p>
            </div>
          ) : loading ? (
            <div className="calendar-loading">Loading availability...</div>
          ) : (
            <>
              <h3>{rooms.find(r => r._id === selectedRoom)?.name}</h3>
              <Calendar
                tileClassName={tileClassName}
                tileDisabled={tileDisabled}
                minDate={new Date()}
              />
              <div className="availability-summary">
                <p>🔴 <strong>{bookedDates.length}</strong> days booked</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AvailabilityCalendar;