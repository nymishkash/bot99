# Radisson Blu Plaza Hotel Booking Chatbot

This project is a chatbot for booking rooms at the Radisson Blu Plaza Hotel. The chatbot uses Google's Generative AI (Gemini) to process user queries and manage hotel bookings through a RESTful API built with Express.js. The frontend is developed using React, and the backend uses SQLite with Sequelize for database management.

## Features

- Natural language processing using Google's Generative AI (Gemini)
- Fetch room details from the hotel API
- Make bookings through the chatbot
- Store conversation history in a SQLite database

## Prerequisites

- Node.js (v14 or later)
- NPM (v6 or later)
- SQLite

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/radisson-blu-chatbot.git
cd radisson-blu-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following variables:

```plaintext
PORT=3000
GEMINI_API_KEY=your_google_generative_ai_api_key
```

### 4. Database Setup

Ensure you have SQLite installed. The project uses Sequelize for ORM.

### 5. Run the Application

```bash
npm start
```

The server will start on the port defined in your `.env` file (default is 3000).

## API Endpoints

### Chat Endpoint

- **POST /chat**

  This endpoint handles user messages and responds with the chatbot's reply.

  **Request Body:**

  ```json
  {
    "message": "I want to book a room."
  }
  ```

  **Response:**

  ```json
  {
    "botMessage": "Sure, which type of room would you like to book?"
  }
  ```

## Project Structure

- `server.js`: Main server file
- `models/`: Contains the Sequelize models
  - `Conversation.js`: Model for storing conversation history
- `functions/`: Contains functions to fetch room details and make bookings
  - `fetchRoomDetails.js`: Function to fetch room details
  - `makeBooking.js`: Function to make a booking
- `frontend/`: Contains the React frontend application
- `.env`: Environment variables

## Dependencies

- Express.js
- CORS
- UUID
- Sequelize
- SQLite3
- @google/generative-ai

## Usage

1. **Start the server:**

   ```bash
   npm start
   ```

2. **Interact with the chatbot via the `/chat` endpoint:**

   Use a tool like Postman or cURL to send messages to the chatbot.

## Error Handling

Errors are logged to the console, and the server responds with a 500 status code for internal server errors.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

This README provides a comprehensive overview of the project, including setup instructions, API endpoints, project structure, and usage. Feel free to customize it further based on your specific requirements.
