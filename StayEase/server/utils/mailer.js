const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendConfirmationEmail = async (reservation) => {
  try {
    await transporter.sendMail({
      from: `StayEase <${process.env.EMAIL_USER}>`,
      to: reservation.guestEmail,
      subject: `Booking Confirmed — Ref: ${reservation.bookingRef}`,
      html: `
        <h2>Your booking is confirmed! 🎉</h2>
        <p>Dear ${reservation.guestName},</p>
        <p>Your reservation at <strong>StayEase</strong> has been confirmed.</p>
        <ul>
          <li><strong>Booking Ref:</strong> ${reservation.bookingRef}</li>
          <li><strong>Check-in:</strong> ${new Date(reservation.checkIn).toDateString()}</li>
          <li><strong>Check-out:</strong> ${new Date(reservation.checkOut).toDateString()}</li>
          <li><strong>Guests:</strong> ${reservation.guests}</li>
          <li><strong>Total Price:</strong> $${reservation.totalPrice}</li>
        </ul>
        <p>Thank you for choosing StayEase!</p>
      `
    });
  } catch (err) {
    console.log('Email error:', err.message);
  }
};

exports.sendCancellationEmail = async (reservation) => {
  try {
    await transporter.sendMail({
      from: `StayEase <${process.env.EMAIL_USER}>`,
      to: reservation.guestEmail,
      subject: `Booking Cancelled — Ref: ${reservation.bookingRef}`,
      html: `
        <h2>Your booking has been cancelled.</h2>
        <p>Dear ${reservation.guestName},</p>
        <p>Your reservation <strong>${reservation.bookingRef}</strong> has been successfully cancelled.</p>
        <p>We hope to see you again at StayEase.</p>
      `
    });
  } catch (err) {
    console.log('Email error:', err.message);
  }
};