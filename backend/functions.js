const axios = require('axios');
const nodemailer = require('nodemailer');

async function fetchRoomDetails() {
  try {
    const response = await axios.get('https://bot9assignement.deno.dev/rooms');
    return response.data;
  } catch (error) {
    console.error('Error fetching room details:', error);
    throw new Error('Failed to fetch room details');
  }
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function makeBooking({ roomId, fullName, email, nights }) {
  try {
    const response = await axios.post('https://bot9assignement.deno.dev/book', {
      roomId,
      fullName,
      email,
      nights
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    async function sendEmail(fullName, email, response) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Booking Confirmation',
        html: `
          <h1>Booking Confirmation</h1>
          <p>Dear ${fullName},</p>
          <p><b>Thank you for booking with the Raddison Blu Plaza Hotel. Your booking details are given below:</b></p>
          <ul>
            <li>Booking ID: ${response.bookingId}</li>
            <li>Room Type: ${response.roomName}</li>
            <li>Number of Nights: ${response.nights}</li>
            <li>Total Price: $${response.totalPrice}</li>
          </ul>
          <p>We look forward to welcoming you to the Radisson Blu Plaza Hotel!</p>
        `
      };
    
      try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully');
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    }

    await sendEmail(fullName, email, response.data);
    
    return response.data; // Assuming the response contains booking details
  } catch (error) {
    console.error('Error making booking:', error);
    throw new Error('Failed to make booking');
  }
}

module.exports = [
  { name: 'fetchRoomDetails', function: fetchRoomDetails },
  { name: 'makeBooking', function: makeBooking }
];
