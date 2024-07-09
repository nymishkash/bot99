---

# bot99

bot99 is a hotel booking chatbot project built using Express.js for the backend and React for the frontend. It integrates with the Google Gemini API for natural language processing and handles hotel room bookings for Radisson Blu Plaza.

## Setup

Follow these steps to set up and run the project locally:

### Prerequisites

- Node.js installed on your machine
- npm or yarn package manager
- Google Gemini API key (obtain from Google Cloud Console)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nymishkash/bot99.git
   cd bot99
   ```

2. Install dependencies for both backend and frontend:

   ```bash
   # Install backend dependencies
   cd backend
   npm install
   # or
   yarn install

   # Install frontend dependencies
   cd ../frontend
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following environment variables to `.env`:
     ```env
     GEMINI_API_KEY=your_google_gemini_api_key
     PORT=3000 # Optional: Customize the port if needed
     ```

### Running the Application

1. Start the backend server (Express.js):
   ```bash
   cd backend
   npm start
   # or
   yarn start
   ```

2. Start the frontend development server (React):
   ```bash
   cd frontend
   npm start
   # or
   yarn start
   ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

- The frontend provides a chat interface where users can interact with the bot to book hotel rooms.
- The backend handles requests, interacts with the Google Gemini API for natural language processing, and manages booking operations.

## API Reference

- **Endpoints**:
  - `/chat`: POST endpoint to send and receive messages from the bot.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- This project was built as part of learning and experimentation with Express.js, React, and Google Gemini API.

---
