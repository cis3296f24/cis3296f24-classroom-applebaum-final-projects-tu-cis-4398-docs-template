import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from './WebSocketContext'; // Import the custom hook

function Game() {
    const [isHost, setIsHost] = useState(false);
    const [messages, setMessages] = useState([]);
    const [role, setRole] = useState(null);
    const [playerName, setPlayerName] = useState(''); // State to store player name
    const [isJoined, setIsJoined] = useState(false); // Track if player has joined the game
    const ws = useWebSocket(); // Get the WebSocket instance from context
    const navigate = useNavigate(); // Hook for navigation

    // Listen for messages from the WebSocket
    useEffect(() => {
        if (ws) {
            const handleMessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'host') {
                    setIsHost(true);
                    sessionStorage.setItem("isHost", true);
                    setMessages((prev) => [...prev, data.message]);
                } else if (data.type === 'player' || data.type === 'message') {
                    setMessages((prev) => [...prev, data.message]);
                } else if (data.type === 'role') {
                    setRole(data.role);
                    sessionStorage.setItem("role", data.role);
                    setMessages((prev) => [...prev, `You are assigned the role of ${data.role}`]);
                }else if (data.type === 'start') {
                    navigate('/startgame');
                }

            };

            // Set the message handler for WebSocket
            ws.addEventListener('message', handleMessage);

        }
    }, [ws]); // Re-run the effect if the WebSocket instance changes

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

    const goToStartGame = () => {
        startGame();
    };

    return (
        <div>
            <div className="gameTitle">
                <h2>MafiUhh...</h2>
            </div>

            {!isJoined ? (
                <div>
                    <div className="limiter">
                        <div className="container-login100">
                            <div className="wrap-login100">
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                />
                                <div className="loginButton-wrap">
                                    <button className="lgn-btn" onClick={handleJoinGame}>
                                        Join Game
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="limiter">
                        <div className="container-login100">
                            <div className="wrap-login100">
                                <>
                                    <div>{messages.map((msg, index) => <p key={index}>{msg}</p>)}</div>
                                    {isHost && <button onClick={goToStartGame}>Start Game</button>}

                                    {role && (
                                        <div>
                                            <h3>Your Role: {role}</h3>
                                        </div>
                                    )}
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game;
