import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Rooms
export const getAllRooms = () => API.get('/rooms');
export const getRoomById = (id) => API.get(`/rooms/${id}`);
export const createRoom = (data) => API.post('/rooms', data);
export const updateRoom = (id, data) => API.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);

// Reservations
export const checkAvailability = (params) => API.get('/reservations/availability', { params });
export const createReservation = (data) => API.post('/reservations', data);
export const getAllReservations = () => API.get('/reservations');
export const getReservationsByEmail = (email) => API.get(`/reservations/guest/${email}`);
export const modifyReservation = (id, data) => API.put(`/reservations/${id}`, data);
export const cancelReservation = (id) => API.patch(`/reservations/${id}/cancel`);

// Pricing
export const getPricingByRoom = (roomId) => API.get(`/pricing/${roomId}`);
export const upsertPricing = (roomId, data) => API.post(`/pricing/${roomId}`, data);