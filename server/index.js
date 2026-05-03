const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.get('/test', (req, res) => res.json({ message: 'Server is working' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/pricing', require('./routes/pricingRoutes'));

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Clear reservations on every restart
    const Reservation = require('./models/Reservation');
    await Reservation.deleteMany();
    console.log('Reservations cleared');

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));