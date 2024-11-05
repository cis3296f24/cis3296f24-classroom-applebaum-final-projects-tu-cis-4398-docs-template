const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

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

            players.push({ ws, name: playerName });

            // Identify the first player as the host
            if (players.length === 1) {
                ws.send(JSON.stringify({ type: 'host', message: 'You are the host' }));
            } else {
                ws.send(JSON.stringify({ type: 'player', message: 'Connected to the game as ' + playerName }));
            }

            // Notify others that a player has joined
            players.forEach(player => {
                if (player.ws !== ws) {
                    player.ws.send(JSON.stringify({ type: 'message', message: playerName + ' has joined the game!' }));
                }
            });
        } else if (data.type === 'start') {
            // Ensure only the host can start the game
            if (players[0].ws === ws) {
                assignRoles(players);
                players.forEach(player => {
                    player.ws.send(JSON.stringify({ type: 'message', message: 'The game has started!' }));
                });
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Only the host can start the game.' }));
            }
        }
    });

    ws.on('close', () => {
        players = players.filter(player => player.ws !== ws);
        players.forEach(player => {
            player.ws.send(JSON.stringify({ type: 'message', message: playerName + ' has left the game.' }));
        });
    });
});

// Role assignment function
function assignRoles(players) {
    const roles = ['Mafia', 'Citizen', 'Citizen', 'Citizen', 'Citizen'];
    const shuffledRoles = roles.slice(0, players.length); // Take only as many roles as there are players

    shuffledRoles.sort(() => Math.random() - 0.5); // Shuffle roles

    players.forEach((player, index) => {
        const role = shuffledRoles[index];
        player.ws.send(JSON.stringify({ type: 'role', role: role }));
    });
}

// Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});