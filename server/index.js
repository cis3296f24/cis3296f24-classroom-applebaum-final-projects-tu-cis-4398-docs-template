const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { roles, roleDesc } = require('./mafiaParameters');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

const cors = require('cors');
app.use(cors());

let players = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Server is up and running ! ! !');
});

wss.on('connection', (ws) => {
    console.log("New WebSocket connection established");

    let playerName;

    ws.send(JSON.stringify({ type: 'rolesList', roleDesc }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'join') {
            playerName = data.name;

            players.push({ ws, name: playerName });

            if (players.length === 1) {
                ws.send(JSON.stringify({ type: 'host', message: 'You are the host' }));
            } else {
                ws.send(JSON.stringify({ type: 'player', message: 'Connected to the game as ' + playerName }));
            }

            players.forEach(player => {
                if (player.ws !== ws) {
                    player.ws.send(JSON.stringify({ type: 'message', message: playerName + ' has joined the game!' }));
                }
            });
        } else if (data.type === 'start') {
            if (players[0].ws === ws) {
                assignRoles(players);
                players.forEach(player => {
                    player.ws.send(JSON.stringify({ type: 'toggleHelpOff' }));
                    player.ws.send(JSON.stringify({ type: 'message', message: 'The game has started!' }));
                    player.ws.send(JSON.stringify({ type: 'startVoting', players: players.map(p => p.name) }));             // sends the start vote message
                });
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Only the host can start the game.' }));
            }
        } else if (data.type === 'vote') {
            handleVoting(playerName, data.playerName);                                                                      // when the vote message is received it runs the voting function
        }
    });

    ws.on('close', () => {
        players = players.filter(player => player.ws !== ws);
        players.forEach(player => {
            player.ws.send(JSON.stringify({ type: 'message', message: playerName + ' has left the game.' }));
        });
    });
});

function assignRoles(players) {                                                                                             // sorts the players
    const sortedRoles = roles.slice(0, players.length);                                                                     // chooses the number of roles to sort based on the number of players

    for (let currentIndex = sortedRoles.length - 1; currentIndex > 0; currentIndex--) {
        const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
        [sortedRoles[currentIndex], sortedRoles[randomIndex]] = [sortedRoles[randomIndex], sortedRoles[currentIndex]];
    }

    players.forEach((player, index) => {
        const roleName = sortedRoles[index].name;
        player.ws.send(JSON.stringify({ type: 'role', role: roleName }));                                                   // sends the roles for each player to the server side
    });
}

let votes = {};                                                                         // stores whether an individual has voted or not
let voteCounts = {};                                                                    // stores the vote tally for each player

function handleVoting(playerName, votedPlayer) {
    if (players.find(player => player.name === playerName && player.eliminated)) {      // checks if the player has already been eliminated so they can't vote then
        return;
    }

    votes[playerName] = votedPlayer;                                                    // associates the player's vote with the person they voted for

    const alivePlayers = players.filter(player => !player.eliminated);                  // stores the alive players

    if (Object.keys(votes).length === alivePlayers.length) {                            // waits until all the alive players have voted before running the next step
        voteCounts = {};

        alivePlayers.forEach(player => {
            const votedFor = votes[player.name];                                        // links an individual's vote to the specific player
            voteCounts[votedFor] = (voteCounts[votedFor] || 0) + 1;                     // adds the vote to the target's vote tally (defaults to 0 if no votes are received)
        });

        let maxVotes = -1;
        let eliminatedPlayer = null;                                                    // sets the eliminated player for this round of voting to NULL
        let tie = false;

        for (const [player, voteCount] of Object.entries(voteCounts)) {
            if (voteCount > maxVotes) {
                maxVotes = voteCount;
                eliminatedPlayer = player;
                tie = false;
            } else if (voteCount === maxVotes) {
                tie = true;
            }
        }

        if (tie) {
            players.forEach(player => {
                player.ws.send(JSON.stringify({ type: 'voteTie', message: 'There was a tie. No player is eliminated this round.' }));
            });
        } else if (eliminatedPlayer) {
            players.forEach(player => {
                player.ws.send(JSON.stringify({ type: 'voteResults', eliminatedPlayer }));  // sends the eliminated player to the server
            });

            players.forEach(player => {                                                     // updates the status of the eliminated player for everyone
                if (player.name === eliminatedPlayer) {
                    player.eliminated = true;
                }
            });
        } else {
            console.error('[Error] No valid player eliminated.');
        }

        votes = {};                                                 // resets the individual's vote (whether they have voted or not)
        voteCounts = {};                                            // resets the total vote tally for each player
    }
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});