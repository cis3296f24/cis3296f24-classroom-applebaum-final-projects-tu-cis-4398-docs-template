import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext'; // Import the custom hook
import RoleDisplay from './roleDisplay';

function StartGame() {
  const ws = useWebSocket(); // Get the WebSocket instance and connection status
  const [messages, setMessages] = useState([]);
  const isHost = sessionStorage.getItem("isHost");
  const role = sessionStorage.getItem("role");


  // Listen for messages from the WebSocket (and update state)
  useEffect(() => {
    if (!ws) {
      console.log("WebSocket is not initialized");
      return;
    }
    console.log("Received isHost:", isHost);
    console.log("Received role:", role);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, data.message]); // Add new message
        } catch (e) {
          console.error("Error processing WebSocket message:", e);
        }
    }

    // Cleanup the WebSocket message handler
    return () => {
      if (ws) {
        ws.onmessage = null; // Remove the message handler when the component unmounts
      }
    };
  }, [ws, isHost, role]); // Re-run the effect if WebSocket instance changes

  return (
    <div>
        <div className="gameTitle">
          <h2>MafiUhh...</h2>
        </div>
      {/* Display messages */}
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      {isHost && (
        <div>
          <h3>You are the host!</h3>
        </div>
      )}

      {/* Display the user's role */}
      {role && (
        <div>
          <RoleDisplay role={role}/>
        </div>
      )}
    </div>
  );
}

export default StartGame;
