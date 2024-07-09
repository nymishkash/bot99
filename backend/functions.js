const axios = require('axios');

async function fetchRoomDetails() {
  try {
    const response = await axios.get('https://bot9assignement.deno.dev/rooms');
    return response.data;
  } catch (error) {
    console.error('Error fetching room details:', error);
    throw new Error('Failed to fetch room details');
  }
}

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
