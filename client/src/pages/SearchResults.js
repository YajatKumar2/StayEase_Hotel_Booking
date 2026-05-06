import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkAvailability } from '../services/api';
import './SearchResults.css';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const checkIn = params.get('checkIn');
  const checkOut = params.get('checkOut');
  const type = params.get('type');
  const guests = params.get('guests');
  const amenities = params.get('amenities');

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await checkAvailability({ checkIn, checkOut, type, amenities });
        const filtered = res.data.filter(room => room.maxGuests >= parseInt(guests));
        setRooms(filtered);
      } catch (err) {
        setError('Failed to fetch available rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [checkIn, checkOut, type, guests]);

  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));

  const getPrice = (room) => {
    if (!room.pricing) return 0;
    return room.pricing.basePrice;
  };

  if (loading) return <div className="loading">Searching available rooms...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="search-results">
      <div className="results-header">
        <h2>Available Rooms</h2>
        <p>{rooms.length} room(s) found · {nights} night(s) · {guests} guest(s)</p>
      </div>
      {rooms.length === 0 ? (
        <div className="no-rooms">
          <h3>No rooms available for selected dates.</h3>
          <button onClick={() => navigate('/')}>Search Again</button>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map(room => (
            <div className="room-card" key={room._id}>
              <div className="room-image">🏨</div>
              <div className="room-info">
                <h3>{room.name}</h3>
                <span className="room-type">{room.type}</span>
                <p>{room.description}</p>
                <div className="amenities">
                  {room.amenities.map(a => <span key={a} className="amenity-tag">{a}</span>)}
                </div>
                <div className="room-footer">
                  <div className="price">
                    <span className="price-amount">${getPrice(room)}</span>
                    <span className="price-night"> / night</span>
                    <div className="price-total">Total: ${getPrice(room) * nights}</div>
                  </div>
                  <button
                    className="book-btn"
                    onClick={() => navigate(`/book/${room._id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&totalPrice=${getPrice(room) * nights}&nights=${nights}&basePrice=${getPrice(room)}`)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
