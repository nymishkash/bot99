import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatBoxRef = useRef(null);

  const sendMessage = async () => {
    const userMessage = input;
    setMessages([...messages, { text: formatMessage(userMessage), sender: 'user' }]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:3000/chat', {
        message: userMessage,
        userId: 'user123' // Static user ID for this example
      });
      const output = await response.data.output;
      console.log(response.data);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: formatMessage(output), sender: 'bot' }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatMessage = (message) => {
    return message.replace(/\*(.*?)\*/g, '<b>$1</b>');
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="App">
      <header className="header">
        <h1>Blubot</h1>
      </header>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`} dangerouslySetInnerHTML={{ __html: msg.text }} />
        ))}
      </div>
      <div className="input-box">
        <input
          placeholder='Type your message here'
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
