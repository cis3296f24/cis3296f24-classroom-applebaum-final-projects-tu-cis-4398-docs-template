import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

// Create a context for WebSocket
const WebSocketContext = createContext();

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);  // Track the WebSocket instance in state
  const wsRef = useRef(null);

  useEffect(() => {
    // Create WebSocket connection
    wsRef.current = new WebSocket('ws://localhost:4000');

    // Handle the 'open' event - WebSocket connection has been established
    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setWs(wsRef.current);
    };

    // Handle incoming messages
    wsRef.current.onmessage = (event) => {
      console.log('Message from server: ', event.data);
    };

    // Handle errors
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Handle the 'close' event - WebSocket connection closed
    wsRef.current.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    // Clean up WebSocket connection on unmount
    return () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close();
          }
        };
      }, []);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};
