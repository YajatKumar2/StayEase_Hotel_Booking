
# 🏨 StayEase - Hotel Booking System

A full-stack hotel reservation platform built with the MERN stack and JSP.
Guests can search for available rooms, make bookings, and manage reservations.
Admins can manage rooms, pricing, and reservations through a protected panel.

---

## Features

### Guest Features
- Search available rooms by date range, room type, and guest count
- View room details, amenities, and pricing
- Book, modify, or cancel reservations
- Receive automatic email confirmation and cancellation notifications
- Look up reservations by email

### Admin Features
- JWT-protected admin login with show/hide password
- View all reservations in a structured table
- Add, edit, and delete room listings
- Manage base pricing and seasonal rates per room
- Print booking vouchers for front-desk use (JSP)

---

## Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | React JS, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Email Service | Nodemailer (Gmail SMTP) |
| Voucher/Print | JSP (Apache Tomcat) |
| Utilities | dotenv, date-fns, uuid, cors |

---

## Project Structure

```
StayEase/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Navbar
│       ├── pages/           # Home, Search, Booking, MyReservations, Admin, AdminLogin
│       └── services/        # API service (Axios)
└── server/                  # Node.js backend
    ├── controllers/         # Auth, Room, Reservation, Pricing logic
    ├── middleware/          # JWT auth middleware
    ├── models/              # Mongoose schemas
    ├── routes/              # Express routes
    └── utils/               # Nodemailer email utility
```

---

## Setup Instructions

### Prerequisites
- Node.js v20+
- MongoDB (via Homebrew on Mac)
- Apache Tomcat (for JSP voucher)
- Gmail account with App Password

### 1. Clone the repository
```bash
git clone https://github.com/YajatKumar2/StayEase.git
cd StayEase
```

### 2. Setup the backend
```bash
cd server
npm install
```

Create a `.env` file inside `server/` with the following:
```
MONGO_URI=mongodb://localhost:27017/stayease
PORT=8000
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=stayease123
JWT_SECRET=stayease_jwt_secret_key
```

### 3. Seed the database
```bash
node seed.js
```

### 4. Start the backend
```bash
npm run dev
```

### 5. Setup the frontend
```bash
cd ../client
npm install
npm start
```

### 6. Setup JSP Voucher (Apache Tomcat)
- Install Tomcat via Homebrew: `brew install tomcat`
- Start Tomcat: `brew services start tomcat`
- Copy the `stayease` folder into Tomcat's webapps directory:
```
/opt/homebrew/opt/tomcat/libexec/webapps/stayease/
```

---

## Running the App

| Service | URL |
|---------|-----|
| React Frontend | http://localhost:3000 |
| Express Backend | http://localhost:8000 |
| Apache Tomcat (JSP) | http://localhost:8080 |

---

## Admin Access

| Field | Value |
|-------|-------|
| URL | http://localhost:3000/admin-login |
| Username | admin |
| Password | stayease123 |

---

## Email Notifications

Automatic emails are sent to guests on:
- ✅ Booking confirmation
- ✅ Reservation cancellation

---

## Project Info

- **Project:** Hotel Booking System
- **Difficulty:** Intermediate
- **Stack:** MERN + JSP
