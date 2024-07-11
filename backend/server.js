require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { Conversation } = require('./models');
const fns = require('./functions');

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  FunctionDeclarationSchemaType,
} = require("@google/generative-ai");

const app = express();                

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  tools: [
    {
      functionDeclarations: [
        {
          name: "fetchRoomDetails",
          description: "Fetch the available room details",
          parameters: {
            type: FunctionDeclarationSchemaType.OBJECT,
            properties: {
              name: {
                type: FunctionDeclarationSchemaType.STRING,
                description: 'The name of the room. eg., Deluxe Room, Executive Room'
              },
              price: {
                type: FunctionDeclarationSchemaType.NUMBER,
                description: 'The price of the room. eg., 5000, 8000'
              },
              description: {
                type: FunctionDeclarationSchemaType.STRING,
                description: 'The description of the room. eg., Modern room with work desk and high-speed internet, Large room with two queen-size beds, perfect for families'
              }
            },
            required: []
          }
        },
        {
          name: "makeBooking",
          description: "Make a booking with the provided details",
          parameters: {
            type: FunctionDeclarationSchemaType.OBJECT,
            properties: {
              roomId: { 
                type: FunctionDeclarationSchemaType.NUMBER, 
                description: "ID of the room to be booked" 
              },
              fullName: { 
                type: FunctionDeclarationSchemaType.STRING, 
                description: "Full name of the person booking" 
              },
              email: { 
                type: FunctionDeclarationSchemaType.STRING, 
                description: "Email of the person booking" 
              },
              nights: { 
                type: FunctionDeclarationSchemaType.NUMBER, 
                description: "Number of nights for the booking" 
              },
            },
            required: ["roomId", "fullName", "email", "nights"]
          }
        }
      ]
    }
  ],
  systemInstruction: `System Instructions for Google Gemini API

Blubot is a chatbot specifically designed to assist customers in making reservations at the Radisson Blu Plaza Hotel. It has the following roles and guidelines:

- REMEMBER: BLUBOT SHOULD NEVER ANSWER ANY QUESTIONS BEYOND ROOM BOOKING CONVERSATIONS. ENSURE YOU ARE AWARE OF WHAT THE USER IS ANSWERING AND IF IT SEEMS IRRELEVANT, REFAIN FROM ANSWERING SUCH QUESTIONS. INSTEAD TELL YHE USER YOUR ONLY PURPOSE IS TO ASSIST IN HOTEL BOOKING AT THE RADISSON BLU PLAZA HOTEL.

- Purpose: Assist customers in making reservations at the Radisson Blu Plaza Hotel only.
- Interaction Style:
  - Ask timely questions about booking parameters one by one.
  - Avoid answering irrelevant questions.
  - Use a friendly and supportive tone.
  - Answer queries patiently.
  - Use simple emoticons like :).
  - Avoid using emojis.
  - Provide outputs neatly formatted with lines, bullet points, and clear, readable information.

- Fetching Room Data:
  - Blubot does not have room type data by default.
  - Use the 'fetchRoomDetails' function to get room type, description, and price from [here](https://bot9assignement.deno.dev/rooms).
  - Show room details to the user once fetched.
  - Provide room options to help the user make a choice.
  - Give specific room details if asked.

- Booking Process:
  - Ask for check-in and check-out dates.
  - Ensure the dates are valid, keep the number of dys in each month in mind. Also consider leap years. Ensure the check in date is before the check out date.
  - Calculate the total cost of booking based on the dates.
  - Store the calculated cost in memory.
  - Ask for booking confirmation.
  - Request the user's full name and email address.
  - Use the 'makeBooking' function to confirm the booking by sending full name, email, and number of nights to [this endpoint](https://bot9assignement.deno.dev/book) in the correct JSON format.
  - Store the received booking ID in memory.
  - Confirm the booking and provide the booking ID to the user.

Blubot's functions:
- fetchRoomDetails: To retrieve room type, description, and price.
- makeBooking: To confirm the booking by sending full name, email, and number of nights in the correct JSON format.

Blubot should always ensure the information provided is clear, neatly formatted, and supportive, guiding the user through each step of the booking process with patience and friendliness.
`,
},
{apiVersion: "v1beta"}
);

let messagelog = [];

const chatSession = model.startChat({
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 1000, // Ensure this value is within the API limits
  responseMimeType: "text/plain",
  history: messagelog,
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const userId = uuidv4();

  try {
    let result = await chatSession.sendMessage(userMessage);
    messagelog.push({ role: 'user', parts: [{ text: userMessage }] });

    let response = result.response;

    let botMessage = response.text();
    messagelog.push({ role: 'model', parts: [{ text: botMessage }] });

    let fnresponse = {};
    
    // Handle function calls
    let functionCalls = result.response.functionCalls();

    let output = "";
    
    if (!(typeof functionCalls === 'undefined') && !(functionCalls.length === 0)) {
      let responses = [];
      for (let call of functionCalls) {
        const { name, args } = call;
        for (let fn of fns) {
          if (name === fn.name) {
            fnresponse = await fn.function(args);
            console.log(fnresponse);
            responses.push(
              {
                  functionResponse: {
                      name,
                      response: JSON.stringify(fnresponse),
                  },
              },
            );
          }
        }
        console.log(responses);
      }
      messagelog.push({ role: 'model', parts:[{text: JSON.stringify(responses)}]});
      let result2 = await chatSession.sendMessage(JSON.stringify(responses));
      output = result2.response.candidates[0].content.parts[0].text;
      
    }
    else {
      console.log(typeof botMessage)
      output = botMessage;
    }

    res.json({ output });


    try {
      await Conversation.create({ userMessage, botMessage, fnresponse, userId });
    } catch (err) {
      console.error('Error saving conversation:', err);
      throw new Error('Database error');
    }
    
  } catch (error) {
    console.error('Error handling chat request:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
