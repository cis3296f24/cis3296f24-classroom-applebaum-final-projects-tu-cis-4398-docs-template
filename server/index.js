const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { roles, roleDesc } = require('./mafiaParameters');       // pulls the list of roles to be sorted and role descriptions
const Player = require('./player');                             // pulls in the player class

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

const cors = require('cors');
app.use(cors());

let players = [];                                               // stores the Player objects (DO NOT MOVE THIS BELOW THIS POSITION OTHERWISE THERE IS A BUG)
let dayTimer;                                                   // stores the night timer number
let nightTimer;                                                  // stores the day timer number
let gamePhase = 'DAY';                                          // stores the default game phase
let timerInterval = null;
let alivePlayers = []; 

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Server is up and running ! ! !');
});

wss.on('connection', (ws) => {
    console.log("[Websocket] Connection Established...");

    let playerName;                                             // stores the player name (inputted by the user)

    ws.send(JSON.stringify({ type: 'rolesList', roleDesc }));   // immediately sends the role descriptions to the frontend (for the help menu)

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'join') {
            playerName = data.name;                             // assigns the name input from the user as their player name

            console.log('Player Name: ' + playerName);

            const isPlayerNameValid = checkPlayerNameValid(playerName, ws);     // check if player name is valid

            if(!isPlayerNameValid) {                                        // if player name invalid, return immediately so this player does not join
                return;
            }

            const newPlayer = new Player(playerName, null);     // initializes a new player object corresponding to the user
            newPlayer.ws = ws;                                  // assigns the websocket to the player's object
            players.push(newPlayer);                            // adds the player object to the players[]

            updateCurrentPlayersList();                                                                                 // send updated list to all players after someone joins

            if (players.length === 1) {
                ws.send(JSON.stringify({ type: 'host', message: 'You are the host' }));                                 // sends a message (through the websocket) to the first player that they are the host
            } else {
                ws.send(JSON.stringify({ type: 'player', message: 'Connected to the game as ' + playerName }));         // sends this message (through the websocket) to the player otherwise
            }

            players.forEach(player => {
                player.ws.send(JSON.stringify({ type: 'message', message: playerName + ' has joined the game!' }));     // sends a message to all other players' frontend that a new player has joined // (accomplished by comparing websockets)
            });
        } else if (data.type === 'start') {
            console.log(data.maxPlayers);
            //kick excess players here
            kickExcessPlayers(data.maxPlayers);
            if (players[0].ws === ws) {                                                                                 // checks that the player who clicked the start button is the host
                assignRoles(players, data.maxPlayers, data.numMafia);                                                   // runs the assignRoles() function using the # of people in the players[]
                players.forEach(player => {
                    player.ws.send(JSON.stringify({ type: 'toggleHelpOff'}));                                           // sends the 'toggleHelpOff' tag to the frontend (see Game.js for use)
                    player.ws.send(JSON.stringify({ type: 'start'}));                                                   // sends the 'start' tag to the frontend (see Game.js for use)
                    player.ws.send(JSON.stringify({ type: 'message', message: 'The game has started!' }));
                });
    
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Only the host can start the game.' }));
            }
        } else if (data.type === 'vote') {
            handleVoting(playerName, data.playerName);                                                                  // when the vote message is received it runs the voting function
        } else if (data.type === 'startVote') {
            alivePlayers = players.filter(player => !player.eliminated);
            gamePhase = data.gamePhase;
            players.forEach(player => {
                player.ws.send(JSON.stringify({ type: 'sync'}));   // sync
            });                                                                         // listens for the signal to begin the voting phase
            players.forEach(player => {
                player.ws.send(JSON.stringify({ type: 'startVoting', players: players.map(player => player.name), alivePlayers: alivePlayers.map(player => player.name) }));   // sends the voting button signal to each player's frontend
            });
        } else if (data.type === 'newNightTimer') {
            console.log("received night Timer [" + data.nightLength + "].");                                                  // debugging
            players.forEach(player => {
                player.ws.send(JSON.stringify({ type: 'newNightTimer', nightLength: data.nightLength }));               // sends the new nighttime timer to each user
            });
            nightTimer = data.nightLength;
        } else if (data.type === 'newDayTimer') {
            console.log("received day Timer [" + data.dayLength + "].");                                                  // debugging
            players.forEach(player => {
                player.ws.send(JSON.stringify({ type: 'newDayTimer', dayLength: data.dayLength }));               // sends the new daytime timer to each user
            });
            dayTimer = data.dayLength;
        } else if (data.type === 'beginDayTimer') {
            beginDayTimer();
            dayTimer = data.dayLength;                                                                                     // day timer number declared here****
        } else if (data.type === 'beginNightTimer') {
            beginNightTimer();
            nightTimer = data.nightLength;                                                                                   // night timer number declared here***
        }
    });

    ws.on('close', () => {
        players = players.filter(player => player.ws !== ws);                                                           // removes the player from the player[]
        players.forEach(player => {
            player.ws.send(JSON.stringify({ type: 'message', message: playerName + ' has left the game.' }));           // sends this message to everyone's frontend
        });
        updateCurrentPlayersList();                                                                                     // send updated list to all players after someone disconnects
    });
});

function checkPlayerNameValid(playerName, ws) {                                                    // function to check valid player names
    const currentPlayers = players.map(player => player.name);
    if (playerName.length > 24) {                                                         // player name must be less than 25 characters
        ws.send(JSON.stringify({type: 'invalidPlayerName', message: "Name must be less than 25 characters long, try again."}));
        return false;                     
    }
    if (currentPlayers.includes(playerName)) {                                              // player name must be unique => not in currentPlayers
        ws.send(JSON.stringify({type: 'invalidPlayerName', message: "Name already taken, try again."}));
        return false;
    }

    ws.send(JSON.stringify({type: 'validPlayerName'}));                                     // if name is valid, send to client to set isJoined(true)
    return true;
  }


  function beginDayTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);                                                   // checks if the timer is currently running and stops it if so             
    }

    players.forEach(player => { 
        player.ws.send(JSON.stringify({ type: 'timer', timeLeft: dayTimer }));             // sends out the current timer number to all users' frontend
    });

    timerInterval = setInterval(() => {
        console.log("Day Timer: " + dayTimer);                                                 // runs through a loop (1000 ms/1 sec) doing the following...
        dayTimer--;

        if (dayTimer < 0) {                                                               // checks if the timer is at 0
            clearInterval(timerInterval);                                               // stops timer if it hits 0                                                        
        } else {
            players.forEach(player => { 
                player.ws.send(JSON.stringify({ type: 'timer', timeLeft: dayTimer }));     // sends out the current timer number to all users' frontend
            });
        }
    }, 1000);
}

function beginNightTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);                                                   // checks if the timer is currently running and stops it if so             
    }

    players.forEach(player => { 
        player.ws.send(JSON.stringify({ type: 'timer', timeLeft: nightTimer }));             // sends out the current timer number to all users' frontend
    });

    timerInterval = setInterval(() => {
        console.log("Night Timer: " + nightTimer);                                                 // runs through a loop (1000 ms/1 sec) doing the following...
        nightTimer--;

        if (nightTimer < 0) {                                                               // checks if the timer is at 0
            clearInterval(timerInterval);                                               // stops timer if it hits 0
        } else {
            players.forEach(player => { 
                player.ws.send(JSON.stringify({ type: 'timer', timeLeft: nightTimer }));     // sends out the current timer number to all users' frontend
            });
        }
    }, 1000);
}

function doPhaseChange() {
    if (gamePhase === 'DAY') {                                                          // swaps the game phase
        gamePhase = 'NIGHT';
    } else {
        gamePhase = 'DAY';
    }

    players.forEach(player => { 
        player.ws.send(JSON.stringify({ type: 'phase', phase: gamePhase }));            // sends out the current timer number to all users' frontend
    });
}

function updateCurrentPlayersList() {                                                   // sends the updated player list to all 
    players.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'updateCurrentPlayerList', currentPlayers: players.map(player => player.name) }));
    });
}

function checkWinConditions() {                                                                                     // checks if a team has won the game
    const mafiaCount = players.filter(player => player.team === "MAFIA" && !player.eliminated).length;              // counts mafia that are still alive
    const citizenCount = players.filter(player => player.team === "CITIZEN" && !player.eliminated).length;          // counts citizens that are still alive

    if (mafiaCount === 0) {  
        clearInterval(timerInterval);                                                                                       // if there are no mafia left, citizens win
        players.forEach(player => {
            const message = player.team === "CITIZEN" ? "You win!" : "You lose.";                                   // sets a message for who wins and loses, different depending on your team
            player.ws.send(JSON.stringify({ type: 'gameOver', message: 'Game Over: Citizens win! ' + message, winner: 'C'}));  // sends game over message to front end
        });
        return true;
    } else if (mafiaCount >= citizenCount ) {  
        clearInterval(timerInterval);                                                                     // if mafia equal or outnumber citizens, mafia wins
        players.forEach(player => {
            const message = player.team === "MAFIA" ? "You win!" : "You lose.";                                     // sets a message for who wins and loses, different depending on your team
            player.ws.send(JSON.stringify({ type: 'gameOver', message: 'Game Over: Mafia win! ' + message, winner: 'M' }));     // sends game over message to front end
        });
        return true;
    }
    return false;
}

function isMafia(role) {                                                                                            // function to check if a role is on the Mafia team, can be updated with added roles.
    if (role === "Mafia") {
        return true
    }
    return false;
}

function kickExcessPlayers(maxPlayers) {
    for (let i = players.length - 1; i >= maxPlayers; i--) { //iterate thorough the players to be removed starting from array's end
        players[i].ws.close(1000, 'Too many players'); //disconnect the players's websocket
        players.splice(i, 1); //remove the player from the list
    }
}

function assignRoles(players, maxPlayers, numMafia) {                           // sorts the players
                                                                                // chooses the number of roles to sort based on the number of players in the join lobby
    sortedRoles = generateRoles(maxPlayers, numMafia);                          // generate shuffled roles array

    let numAssigned = 0;

    players.forEach((player, index) => {
        if (numAssigned < maxPlayers){
            const roleName = sortedRoles[index].name;                           // assigns the role given by the sorting method to roleName
            player.role = roleName;
            if (isMafia(roleName)) {                                            // assigns teams to players when role is assigned
                player.team = 'MAFIA';
            } else {
                player.team = 'CITIZEN';
            }
            player.ws.send(JSON.stringify({ type: 'role', role: roleName }));
            numAssigned++;                                                      // sends the roles for each player to the server side  
        }                                   
    });
}

function generateRoles(maxPlayers, numMafia){

    const mafia = Array(numMafia).fill({ name: 'Mafia' });

    const citizens = Array(maxPlayers - numMafia).fill({ name: 'Citizen' });

    const finalRoles = [...mafia, ...citizens];

    return finalRoles.sort(() => Math.random() - 0.5);
}

function handleVoting(playerName, targetPlayer) {
    const votingPlayer = players.find(player => player.name === playerName);    // searches players[] and sets that player who was passed through as the voting player

    if (!votingPlayer || votingPlayer.eliminated) {                             // if the voting player is undefined or dead, then they can't vote
        return;
    }

    votingPlayer.voteFor(targetPlayer);                                         // updates the voting player' object to signify they have voted, and they have voted for target player               
    
    let votingPlayers;

    if(gamePhase === 'DAY'){
        votingPlayers = alivePlayers.map(player => player);          // filters out the dead players and assigns the remaining to alivePlayers
    } else{
        votingPlayers = alivePlayers.filter(player => (player.role !== 'Citizen'));
    }  

    const votedPlayers = votingPlayers.filter(player => player.hasVoted);        // of the alive players, it filters out the players that have voted and assigns them into votedPLayers

    console.log(votedPlayers.length);
    console.log(votingPlayers.length);

    if (votedPlayers.length === votingPlayers.length) {   
        console.log("hi");                       // checks if the number of players who voted matches the number of alive players
        const voteCounts = {};                                                  // stores the vote tally for each player

        votingPlayers.forEach(player => {
            const votedFor = player.targetVote;
            voteCounts[votedFor] = (voteCounts[votedFor] || 0) + 1;         // adds a vote tally to the target player if there is a vote for them, otherwise it defaults to zero
        });

        let maxVotes = -1;                                                      // sets the initial vote count for every player to -1
        let eliminatedPlayer = null;                                            // default sets the eliminated player for each round to null
        let eliminatedTeam = null                                               // default sets the eliminated player role for each round to null
        let tie = false;                                                        // default sets the boolean flag for tie to false
        let halfVoted = true;


        for (const [votedFor, count] of Object.entries(voteCounts)) {           // goes through ALL of the entires in voteCounts (one time run-through)
            console.log(votedFor);
            console.log(count);
            if (votedFor !== "null" && count > maxVotes) {                                             // checks to see if the current player's vote count is higher than the highest vote count
                maxVotes = count;                                               // assigns the number of votes that person received to maxVotes
                eliminatedPlayer = votedFor;                                    // sets the eliminated player to the person who received the most votes
                eliminatedTeam = alivePlayers.find(player => player.name === eliminatedPlayer).team; // looks at alivePlayers for the player being eliminated, set eliminatedTeam to that role.
                tie = false;
            } else if(votedFor ==="null" && count > (votedPlayers.length/2)){
                halfVoted = false;
            } else if (count === maxVotes) {                                    // if max votes are equal, set a tie
                tie = true;
            }
        }

        if (tie) {                                                                              // runs if there is a tie
            players.forEach(player => {
                player.ws.send(JSON.stringify({ type: 'voteTie', message: 'There was a tie. No player is eliminated this round.' }));
            });
        } else if (!halfVoted) {                                                                              // runs if there is a tie
            players.forEach(player => {
                player.ws.send(JSON.stringify({ type: 'voteTie', message: 'No one has been eliminated this round.' }));
            });
        } else if (eliminatedPlayer) {                                                          // runs if a player is eliminated
            const playerToEliminate = alivePlayers.find(player => player.name === eliminatedPlayer); // sets the status of the eliminated player to true
            playerToEliminate.eliminate();

            let over = checkWinConditions(); // check win conditions after player has been eliminated


            if(!over){
                playerToEliminate.ws.send(JSON.stringify({ type: 'dead'}));                         // send dead data type to player to be sent to dead screen *this must be on the top as to not navigate to the Eliminated screen before

                players.forEach(player => {                                                         // sends all players result of vote and message
                    player.ws.send(JSON.stringify({ type: 'voteResults', eliminatedPlayer, message:  eliminatedPlayer + ' has been eliminated. They were a ' + eliminatedTeam + "!"}));      // sends the eliminated player tag to everyone's front end with the username
                });
            }
                                                              
         } else {
            console.error('[Error] No valid player eliminated.');
        }

        players.forEach(player => player.resetVote());                                          // resets the votes for each player
    }
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});