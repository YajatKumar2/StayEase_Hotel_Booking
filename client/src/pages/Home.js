import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Home.css';
import { useEffect, useRef } from 'react';

const AMENITIES = ['WiFi', 'AC', 'TV', 'Hot Water', 'Mini Bar', 'Bathtub', 'Balcony', 'Butler Service'];

function Home() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [type, setType] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAmenities, setShowAmenities] = useState(false);

  const amenityRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (amenityRef.current && !amenityRef.current.contains(e.target)) {
        setShowAmenities(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSearch = () => {
    if (!checkIn || !checkOut) return alert('Please select check-in and check-out dates');
    if (checkOut <= checkIn) return alert('Check-out must be after check-in');
    const amenitiesParam = selectedAmenities.length > 0 ? selectedAmenities.join(',') : '';
    navigate(`/search?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&type=${type}&guests=${guests}&amenities=${amenitiesParam}`);
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Stay</h1>
          <p>Discover comfort, luxury, and convenience at StayEase</p>
          <div className="search-box">
            <div className="search-field">
              <label>Check-in</label>
              <DatePicker
                selected={checkIn}
                onChange={date => setCheckIn(date)}
                minDate={new Date()}
                placeholderText="Select date"
                className="date-input"
              />
            </div>
            <div className="search-field">
              <label>Check-out</label>
              <DatePicker
                selected={checkOut}
                onChange={date => setCheckOut(date)}
                minDate={checkIn || new Date()}
                placeholderText="Select date"
                className="date-input"
              />
            </div>
            <div className="search-field">
              <label>Room Type</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="">Any</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div className="search-field">
              <label>Guests</label>
              <input
                type="number"
                min="1"
                max="10"
                value={guests}
                onChange={e => setGuests(e.target.value)}
              />
            </div>
            <div className="search-field amenity-field" ref={amenityRef}>
              <label>Amenities</label>
              <button
                className="amenity-toggle"
                onClick={() => setShowAmenities(!showAmenities)}
                type="button"
              >
                {selectedAmenities.length > 0 ? `${selectedAmenities.length} selected` : 'Any'} ▾
              </button>
              {showAmenities && (
                <div className="amenity-dropdown">
                  {AMENITIES.map(amenity => (
                    <label key={amenity} className="amenity-option">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button className="search-btn" onClick={handleSearch}>Search Rooms</button>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="feature-card">🛎️<h3>Premium Service</h3><p>24/7 concierge and room service for all guests</p></div>
        <div className="feature-card">🌿<h3>Peaceful Environment</h3><p>Serene surroundings for a relaxing experience</p></div>
        <div className="feature-card">🔒<h3>Secure Booking</h3><p>Safe and easy reservations with instant confirmation</p></div>
        <div className="feature-card">📧<h3>Email Confirmation</h3><p>Instant booking confirmation sent to your inbox</p></div>
      </div>
    </div>
  );
}

export default Home;