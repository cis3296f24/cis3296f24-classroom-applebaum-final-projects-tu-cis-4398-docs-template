import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from './WebSocketContext'; // Import the custom hook

function Game() {
    const [isHost, setIsHost] = useState(false);// uses state to determine if a player is the host (unlocks the start button)
    const [messages, setMessages] = useState([]);       // uses state to change the message delivered to the player 
    const [role, setRole] = useState(null);             // uses state to change and store the player's role (default is NULL)
    const [playerName, setPlayerName] = useState('');   // uses state to change and store player names (default is '')
    const [isJoined, setIsJoined] = useState(false);    // uses state to determine if a player has joined the game
    const [showHelp, setShowHelp] = useState(false);    // uses state to toggle the help menu
    const [rolesList, setRolesList] = useState([]);     // uses state to store the entire roles list
    const ws = useWebSocket(); // Get the WebSocket instance from context
    const navigate = useNavigate(); // Hook for navigation


    // Listen for messages from the WebSocket
    useEffect(() => {
        if (ws) {
            const handleMessage = (event) => {
                const data = JSON.parse(event.data);
            
                if (data.type === 'host') {
                    setIsHost(true);
                    //sessionStorage.setItem("isHost", true);
                    setMessages(prev => [...prev, data.message]);
                } else if (data.type === 'player' || data.type === 'message') {
                    setMessages(prev => [...prev, data.message]);
                } else if (data.type === 'role') {
                    setRole(data.role);
                    //sessionStorage.setItem("role", data.role);
                    setMessages(prev => [...prev, `You are assigned the role of ${data.role}`]);
                } else if (data.type === 'rolesList') {
                    setRolesList(data.roleDesc);     
                    //sessionStorage.setItem("role", data.role);         // for the entire roles list (not one unit)
                } else if (data.type === 'toggleHelpOff') { 
                    setShowHelp(false);                     // universal toggle-off for the help menu
                } else if (data.type === 'start') {
                    navigate('/startgame', { state: { role, playerName, isHost} });
                } 
            };
            ws.addEventListener('message', handleMessage)

            return () => {
                    ws.removeEventListener('message', handleMessage);
            };
        }


    }, [ws, navigate, role, playerName, isHost]); // Re-run the effect if the WebSocket instance changes
    
    function isMafia(role) {
        if (role != "Citizen") {
            return true;
        }
        return false;
    }

    const handleJoinGame = () => {
        if (playerName.trim() && ws) {
            ws.send(JSON.stringify({ type: 'join', name: playerName }));
            setIsJoined(true); // Mark as joined to hide join controls
        }
    };

    const startGame = () => {
        if (isHost && ws) {
            ws.send(JSON.stringify({ type: 'start' }));
        }
    };

    const toggleHelp = () => {
        setShowHelp(!showHelp);
    };
    
    const goToStartGame = () => {
        startGame();
    };


    return (
        <div>

            {!isJoined ? (
                <div className="login">
                    <div className="gameTitle">
                                <h2>MAFIUHH...</h2>
                        </div>
                        <div className="container-login100">
                            <div className="wrap-login100">
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                />
                                <div className="glow">
                                    <button className="lgn-btn" onClick={handleJoinGame}>
                                        Join Game
                                    </button>
                                </div>
                            </div>
                        </div>
                </div>
            ) : (
                <div className="login">
                <div className="gameTitle">
                            <h2>MAFIUHH...</h2>
                    </div>
                            <div className="container-login100">
                                <div className="wrap-login100">
        
                                    <div>{messages.map((msg, index) => <p key={index}>{msg}</p>)}</div>

                                    <div className="glow">
                                        {isHost && <button onClick={goToStartGame}>Start Game</button>}
                                    </div>

                                    <div>
                                        <button onClick={toggleHelp}>Help</button>
                                    </div>
                                    {showHelp && (
                                        <div className ="helpbox">
                                            <h3>Character Roles</h3>
                                            {rolesList
                                                .filter((value, index, self) =>
                                                    index === self.findIndex((t) => t.name === value.name)  // Ensures distinct roles by name
                                                )
                                                .map((roleDesc, index) => (
                                                <div className="helplist" key={index}>
                                                    <h4>{roleDesc.name}</h4>
                                                    <p>{roleDesc.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                    </div>
            )}
        </div>
    );
}

export default Game;
