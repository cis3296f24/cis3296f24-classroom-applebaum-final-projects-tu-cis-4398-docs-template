import React, { useState, useEffect, useRef } from 'react';

function Game() {
    const [isHost, setIsHost] = useState(false);        // uses state to determine if a player is the host (unlocks the start button)
    const [messages, setMessages] = useState([]);       // uses state to change the message delivered to the player 
    const [role, setRole] = useState(null);             // uses state to change and store the player's role (default is NULL)
    const [playerName, setPlayerName] = useState('');   // uses state to change and store player names (default is '')
    const [isJoined, setIsJoined] = useState(false);    // uses state to determine if a player has joined the game
    const [showHelp, setShowHelp] = useState(false);    // uses state to toggle the help menu
    const [rolesList, setRolesList] = useState([]);     // uses state to store the entire roles list
    
    const [players, setPlayers] = useState([]);         // uses state to store the player list for voting
    const [voting, setVoting] = useState(false);        // uses state to determine when voting occurs
    const [votes, setVotes] = useState({});             // uses state to store a player's vote
    const [isLocal, setIsLocal] = useState(true);
    const [eliminatedPlayers, setEliminatedPlayers] = useState([]);     // uses state to store a list of eliminated players

    const ws = useRef(null);

    useEffect(() => {
        if (isLocal) {
            ws.current = new WebSocket('ws://localhost:4000/ws');
        } else {
            ws.current = new WebSocket('wss://mafia-uhh-server.onrender.com/ws');
        }

        console.log(ws.current);

        //ws.current = new WebSocket('wss://mafia-uhh-server.onrender.com/ws');

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'host') {
                setIsHost(true);
                setMessages(prev => [...prev, data.message]);
            } else if (data.type === 'player' || data.type === 'message') {
                setMessages(prev => [...prev, data.message]);
            } else if (data.type === 'role') {
                setRole(data.role);
                setMessages(prev => [...prev, `You are assigned the role of ${data.role}`]);
            } else if (data.type === 'rolesList') {
                setRolesList(data.roleDesc);
            } else if (data.type === 'toggleHelpOff') {
                setShowHelp(false);
            } else if (data.type === 'startVoting') {
                setVoting(true);                                                                    // turns on voting
                setPlayers(data.players);
                setVotes({});                                                                       // reset vote tally for players
            } else if (data.type === 'voteResults') {
                setEliminatedPlayers(prev => [...prev, data.eliminatedPlayer]);                     // adds the eliminated player to the array
                setVoting(false);                                                                   // turns off voting (can be useful for next phase implementation)
                setMessages(prev => [...prev, `${data.eliminatedPlayer} has been eliminated! They were a ${data.eliminatedRole}!`]);
                setVotes({});                                                                       // reset vote tally for players
            } else if (data.type === 'voteTie') {
                setVoting(false);                                                                   // turns off voting
                setMessages(prev => [...prev, data.message]);                                       // reset vote tally for players
                setVotes({});
            }
        };

        return () => {
            ws.current.close();
        };
    }, []);

    //const alivePlayers = players.filter(player => !eliminatedPlayers.includes(player));             // stores the alive players (will be useful for win conditions)

    const handleJoinGame = () => {
        if (playerName.trim()) {
            ws.current.send(JSON.stringify({ type: 'join', name: playerName }));
            setIsJoined(true);
        }
    };

    const startGame = () => {
        if (isHost) {
            ws.current.send(JSON.stringify({ type: 'start' }));
        }
    };

    const toggleHelp = () => {
        setShowHelp(!showHelp);
    };

    const voteForPlayer = (playerName) => {
        if (votes[playerName] || eliminatedPlayers.includes(playerName)) return;    // checks to see if a player already voted or dead; prevents a player voting more than once

        setVotes({ ...votes, [playerName]: true });                                 // stores the votes for players and sets whether they have voted to true
    
        ws.current.send(JSON.stringify({ type: 'vote', playerName: playerName }));  // sends the player's vote to the server
    };

    const getRoleImage = () => {
        if (role === 'Mafia') {
            return '/mafia.jpg';                                                    // Path to the mafia image in the public folder
        } else if (role === 'Citizen') {
            return '/citizen.jpg';                                                  // Path to the citizen image in the public folder
        }
        return null;                                                                // No image if no role assigned
    };

    return (
        <div>
            <h2>Game Messages</h2>
            <div>{messages.map((msg, index) => <p key={index}>{msg}</p>)}</div>

            {!isJoined ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                    <button onClick={handleJoinGame}>Join Game</button>
                </div>
            ) : (
                <>
                    {isHost && <button onClick={startGame}>Start Game</button>}
                    
                    {role && (
                        <div>
                            <h3>Your Role: {role}</h3>
                            <img src={getRoleImage()} alt={role} style={{ width: '300px', marginTop: '20px' }} />
                        </div>
                    )}

                    <button onClick={toggleHelp}>Help</button>

                    {showHelp && (
                        <div>
                            <h3>Character Roles</h3>
                            {rolesList.map((roleDesc, index) => (
                                <div key={index}>
                                    <h4>{roleDesc.name}</h4>
                                    <p>{roleDesc.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {voting && !eliminatedPlayers.includes(playerName) && (
                        <div>
                            <h3>Vote to Eliminate a Player</h3>
                            {players.map(player => (
                                <button key={player} onClick={() => voteForPlayer(player)} disabled={eliminatedPlayers.includes(player)}>
                                    {player}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Game;
