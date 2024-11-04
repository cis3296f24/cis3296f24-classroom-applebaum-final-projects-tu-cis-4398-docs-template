const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const MAX_PLAYERS = 5; // Limit to 5 players for now
let players = [];

// Serve static files if you have a front-end in /public
app.use(express.static('public'));

// Handle WebSocket connections
wss.on('connection', (ws) => {
    let playerName;
  
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      if (data.type === 'join') {
        playerName = data.name;
  
        if (players.length >= MAX_PLAYERS) {
          ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
          ws.close();
          return;
        }
  
        players.push({ ws, name: playerName }); // Store both WebSocket and player name
  
        // Notify the new player
        ws.send(JSON.stringify({ type: 'message', message: 'Connected to the game as ' + playerName }));
  
        // Notify other players of the new player
        players.forEach(player => {
          if (player.ws !== ws) {
            player.ws.send(JSON.stringify({ type: 'message', message: playerName + ' has joined the game!' }));
          }
        });
  
        // Assign roles if maximum players reached
        if (players.length === MAX_PLAYERS) {
          assignRoles(players);
        }
      }
    });
  
    // Handle player disconnection
    ws.on('close', () => {
      players = players.filter(player => player.ws !== ws);
      players.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'message', message: playerName + ' has left the game.' }));
      });
    });
  });

// Role assignment function
function assignRoles(players) {
  const roles = ['Mafia', 'Citizen', 'Citizen', 'Cop', 'Healer'];
  players.forEach((player, index) => {
    const role = roles[index];
    player.send(JSON.stringify({ type: 'role', role: role }));
  });
}

// Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});