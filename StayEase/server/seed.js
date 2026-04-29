const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');
const Pricing = require('./models/Pricing');

dotenv.config();

const rooms = [
  {
    name: 'Garden View Single',
    type: 'Single',
    description: 'A cozy single room with a beautiful garden view, perfect for solo travelers.',
    amenities: ['WiFi', 'AC', 'TV', 'Hot Water'],
    maxGuests: 1,
    images: []
  },
  {
    name: 'Classic Double Room',
    type: 'Double',
    description: 'A spacious double room with modern furnishings and city views.',
    amenities: ['WiFi', 'AC', 'TV', 'Hot Water', 'Mini Bar'],
    maxGuests: 2,
    images: []
  },
  {
    name: 'Family Deluxe Room',
    type: 'Deluxe',
    description: 'A large deluxe room ideal for families with premium amenities.',
    amenities: ['WiFi', 'AC', 'TV', 'Hot Water', 'Mini Bar', 'Bathtub'],
    maxGuests: 4,
    images: []
  },
  {
    name: 'Royal Suite',
    type: 'Suite',
    description: 'Our finest suite with panoramic views, a private lounge, and butler service.',
    amenities: ['WiFi', 'AC', 'TV', 'Hot Water', 'Mini Bar', 'Bathtub', 'Butler Service', 'Private Lounge'],
    maxGuests: 2,
    images: []
  },
  {
    name: 'Ocean View Double',
    type: 'Double',
    description: 'A premium double room with stunning ocean views and a private balcony.',
    amenities: ['WiFi', 'AC', 'TV', 'Hot Water', 'Mini Bar', 'Balcony'],
    maxGuests: 2,
    images: []
  },
  {
    name: 'Budget Single Room',
    type: 'Single',
    description: 'An affordable single room with all essential amenities for a comfortable stay.',
    amenities: ['WiFi', 'AC', 'Hot Water'],
    maxGuests: 1,
    images: []
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await Room.deleteMany();
    await Pricing.deleteMany();
    console.log('Cleared existing data');

    // Insert rooms
    const insertedRooms = await Room.insertMany(rooms);
    console.log('Rooms inserted');

    // Create pricing for each room
    const pricingData = [
      {
        room: insertedRooms[0]._id,
        basePrice: 80,
        seasonalRates: [
          { label: 'Summer', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-31'), price: 100 }
        ]
      },
      {
        room: insertedRooms[1]._id,
        basePrice: 120,
        seasonalRates: [
          { label: 'Summer', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-31'), price: 150 }
        ]
      },
      {
        room: insertedRooms[2]._id,
        basePrice: 180,
        seasonalRates: [
          { label: 'Summer', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-31'), price: 220 }
        ]
      },
      {
        room: insertedRooms[3]._id,
        basePrice: 350,
        seasonalRates: [
          { label: 'Summer', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-31'), price: 420 }
        ]
      },
      {
        room: insertedRooms[4]._id,
        basePrice: 160,
        seasonalRates: [
          { label: 'Summer', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-31'), price: 200 }
        ]
      },
      {
        room: insertedRooms[5]._id,
        basePrice: 60,
        seasonalRates: [
          { label: 'Summer', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-31'), price: 75 }
        ]
      }
    ];

    await Pricing.insertMany(pricingData);
    console.log('Pricing inserted');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedDB();