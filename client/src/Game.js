import React, { useState, useEffect } from 'react';

const Game = () => {
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState('Enter your name to join the game.');
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [socket, setSocket] = useState(null);

  const handleJoinGame = () => {
    if (!playerName) return;

    const newSocket = new WebSocket('ws://localhost:4000');

    newSocket.onopen = () => {
      setStatus(`Connected as: ${playerName}`);
      newSocket.send(JSON.stringify({ type: 'join', name: playerName })); // Send join message to server
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'role') {
        setRole(message.role);
        setStatus(`You are assigned as: ${message.role}`);
      } else if (message.type === 'message') {
        console.log(message.message);
        setPlayers((prev) => [...prev, message.message]); // Update players list
      } else if (message.type === 'error') {
        setStatus(message.message);
      }
    };

    newSocket.onclose = () => {
      setStatus('Disconnected from the game');
      setPlayers([]); // Clear players on disconnection
    };

    setSocket(newSocket); // Store the socket for later use
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Mafia Game</h1>
      <p>{status}</p>
      {!role && (
        <div>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={handleJoinGame}>Join Game</button>
        </div>
      )}
      {role && <h2>Your Role: {role}</h2>}
      <h3>Players in the game:</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
    </div>
  );
};

export default Game;