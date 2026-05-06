import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import {
  getAllRooms, createRoom, updateRoom, deleteRoom,
  getAllReservations, upsertPricing, getPricingByRoom,
  cancelReservation
} from '../services/api';

function AdminPanel() {
  const [tab, setTab] = useState('reservations');
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomForm, setRoomForm] = useState({
    name: '', type: 'Single', description: '',
    amenities: '', maxGuests: 1
  });
  const [pricingForm, setPricingForm] = useState({
    basePrice: '', seasonLabel: '', seasonStart: '',
    seasonEnd: '', seasonPrice: ''
  });
  const [selectedRoom, setSelectedRoom] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, resRes] = await Promise.all([
        getAllRooms(), getAllReservations()
      ]);
      setRooms(roomsRes.data);
      setReservations(resRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSubmit = async () => {
    if (!roomForm.name || !roomForm.description) return setMessage('Please fill in all fields');
    try {
      const data = {
        ...roomForm,
        amenities: roomForm.amenities.split(',').map(a => a.trim()).filter(Boolean),
        maxGuests: parseInt(roomForm.maxGuests)
      };
      if (editingRoom) {
        await updateRoom(editingRoom, data);
        setMessage('Room updated successfully');
      } else {
        await createRoom(data);
        setMessage('Room created successfully');
      }
      setRoomForm({ name: '', type: 'Single', description: '', amenities: '', maxGuests: 1 });
      setEditingRoom(null);
      fetchData();
    } catch (err) {
      setMessage('Failed to save room');
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room._id);
    setRoomForm({
      name: room.name,
      type: room.type,
      description: room.description,
      amenities: room.amenities.join(', '),
      maxGuests: room.maxGuests
    });
    setTab('rooms');
    window.scrollTo(0, 0);
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await deleteRoom(id);
      setMessage('Room deleted');
      fetchData();
    } catch (err) {
      setMessage('Failed to delete room');
    }
  };

  const handlePricingSubmit = async () => {
    if (!selectedRoom || !pricingForm.basePrice) return setMessage('Please select a room and enter base price');
    try {
      const data = {
        basePrice: parseFloat(pricingForm.basePrice),
        seasonalRates: pricingForm.seasonLabel ? [{
          label: pricingForm.seasonLabel,
          startDate: pricingForm.seasonStart,
          endDate: pricingForm.seasonEnd,
          price: parseFloat(pricingForm.seasonPrice)
        }] : []
      };
      await upsertPricing(selectedRoom, data);
      setMessage('Pricing updated successfully');
      setPricingForm({ basePrice: '', seasonLabel: '', seasonStart: '', seasonEnd: '', seasonPrice: '' });
    } catch (err) {
      setMessage('Failed to update pricing');
    }
  };

  const loadPricing = async (roomId) => {
    setSelectedRoom(roomId);
    if (!roomId) return;
    try {
      const res = await getPricingByRoom(roomId);
      if (res.data) {
        const s = res.data.seasonalRates?.[0];
        setPricingForm({
          basePrice: res.data.basePrice || '',
          seasonLabel: s?.label || '',
          seasonStart: s?.startDate?.slice(0, 10) || '',
          seasonEnd: s?.endDate?.slice(0, 10) || '',
          seasonPrice: s?.price || ''
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const statusColor = (status) => {
    if (status === 'confirmed') return '#2ecc71';
    if (status === 'cancelled') return '#e74c3c';
    if (status === 'modified') return '#f39c12';
    return '#999';
  };

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      {message && (
        <div className="admin-message" onClick={() => setMessage('')}>
          {message} <span>✕</span>
        </div>
      )}
      <div className="admin-tabs">
        <button className={tab === 'reservations' ? 'active' : ''} onClick={() => setTab('reservations')}>
          Reservations ({reservations.length})
        </button>
        <button className={tab === 'rooms' ? 'active' : ''} onClick={() => setTab('rooms')}>
          Manage Rooms
        </button>
        <button className={tab === 'pricing' ? 'active' : ''} onClick={() => setTab('pricing')}>
          Pricing
        </button>
        <button
          className="report-btn"
          onClick={() => {
            const token = sessionStorage.getItem('adminToken');
            window.open(`http://localhost:8080/stayease/report.jsp?token=${token}`, '_blank');
          }}
        >
          📊 Daily Report
        </button>
      </div>

      {tab === 'reservations' && (
        <div className="admin-section">
          <h3>All Reservations</h3>
          <div className="reservations-table-wrap">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Guest</th>
                  <th>Email</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Voucher</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r._id}>
                    <td><strong>{r.bookingRef}</strong></td>
                    <td>{r.guestName}</td>
                    <td>{r.guestEmail}</td>
                    <td>{r.room?.name || '—'}</td>
                    <td>{new Date(r.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(r.checkOut).toLocaleDateString()}</td>
                    <td>${r.totalPrice}</td>
                    <td>
                      <span className="status-badge" style={{ background: statusColor(r.status) }}>
                        {r.status}
                      </span>
                    </td>
                    
                    <td>
                      {r.status !== 'cancelled' && (
                        <button
                          className="admin-cancel-btn"
                          onClick={async () => {
                            if (!window.confirm('Cancel this reservation?')) return;
                            try {
                              await cancelReservation(r._id);
                              setReservations(reservations.map(res =>
                                res._id === r._id ? { ...res, status: 'cancelled' } : res
                              ));
                              setMessage('Reservation cancelled successfully');
                            } catch (err) {
                              setMessage('Failed to cancel reservation');
                            }
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>

                    <td>
                      <button
                        className="voucher-btn"
                        onClick={() => {
                          const params = new URLSearchParams({
                            bookingRef: r.bookingRef,
                            guestName: r.guestName,
                            guestEmail: r.guestEmail,
                            roomName: r.room?.name || 'N/A',
                            roomType: r.room?.type || 'N/A',
                            checkIn: new Date(r.checkIn).toDateString(),
                            checkOut: new Date(r.checkOut).toDateString(),
                            guests: r.guests,
                            totalPrice: r.totalPrice,
                            status: r.status
                          });
                          window.open(`http://localhost:8080/stayease/voucher.jsp?${params.toString()}`, '_blank');
                        }}
                      >
                        🖨️ Voucher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'rooms' && (
        <div className="admin-section">
          <h3>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
          <div className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Room Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ocean View Double"
                  value={roomForm.name}
                  onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select
                  value={roomForm.type}
                  onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}
                >
                  <option>Single</option>
                  <option>Double</option>
                  <option>Deluxe</option>
                  <option>Suite</option>
                </select>
              </div>
              <div className="form-group">
                <label>Max Guests</label>
                <input
                  type="number"
                  min="1"
                  value={roomForm.maxGuests}
                  onChange={e => setRoomForm({ ...roomForm, maxGuests: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Room description"
                value={roomForm.description}
                onChange={e => setRoomForm({ ...roomForm, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Amenities (comma separated)</label>
              <input
                type="text"
                placeholder="WiFi, AC, TV, Mini Bar"
                value={roomForm.amenities}
                onChange={e => setRoomForm({ ...roomForm, amenities: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button className="save-btn" onClick={handleRoomSubmit}>
                {editingRoom ? 'Update Room' : 'Add Room'}
              </button>
              {editingRoom && (
                <button className="cancel-edit-btn" onClick={() => {
                  setEditingRoom(null);
                  setRoomForm({ name: '', type: 'Single', description: '', amenities: '', maxGuests: 1 });
                }}>
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
          <h3 style={{ marginTop: '40px' }}>All Rooms</h3>
          <div className="rooms-list">
            {rooms.map(room => (
              <div className="admin-room-card" key={room._id}>
                <div>
                  <h4>{room.name}</h4>
                  <span className="room-type-badge">{room.type}</span>
                  <p>{room.description}</p>
                  <div className="amenities">
                    {room.amenities.map(a => <span key={a} className="amenity-tag">{a}</span>)}
                  </div>
                </div>
                <div className="room-card-actions">
                  <button className="edit-btn" onClick={() => handleEditRoom(room)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteRoom(room._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'pricing' && (
        <div className="admin-section">
          <h3>Manage Pricing</h3>
          <div className="admin-form">
            <div className="form-group">
              <label>Select Room</label>
              <select value={selectedRoom} onChange={e => loadPricing(e.target.value)}>
                <option value="">-- Select a room --</option>
                {rooms.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Base Price per Night ($)</label>
              <input
                type="number"
                placeholder="e.g. 120"
                value={pricingForm.basePrice}
                onChange={e => setPricingForm({ ...pricingForm, basePrice: e.target.value })}
              />
            </div>
            <h4>Seasonal Rate (Optional)</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Season Label</label>
                <input
                  type="text"
                  placeholder="e.g. Summer"
                  value={pricingForm.seasonLabel}
                  onChange={e => setPricingForm({ ...pricingForm, seasonLabel: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={pricingForm.seasonStart}
                  onChange={e => setPricingForm({ ...pricingForm, seasonStart: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={pricingForm.seasonEnd}
                  onChange={e => setPricingForm({ ...pricingForm, seasonEnd: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Seasonal Price ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={pricingForm.seasonPrice}
                  onChange={e => setPricingForm({ ...pricingForm, seasonPrice: e.target.value })}
                />
              </div>
            </div>
            <button className="save-btn" onClick={handlePricingSubmit}>Save Pricing</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;