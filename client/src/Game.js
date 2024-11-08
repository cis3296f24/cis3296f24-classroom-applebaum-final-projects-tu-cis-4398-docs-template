import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Game() {
    const [isHost, setIsHost] = useState(false);
    const [messages, setMessages] = useState([]);
    const [role, setRole] = useState(null);
    const [playerName, setPlayerName] = useState(''); // State to store player name
    const [isJoined, setIsJoined] = useState(false); // Track if player has joined the game
    const ws = useRef(null);
    const navigate = useNavigate(); // Hook for navigation

  

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:4000');

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
            }
        };

        return () => {
            ws.current.close();
        };
    }, []);

    const handleJoinGame = () => {
        if (playerName.trim()) {
            ws.current.send(JSON.stringify({ type: 'join', name: playerName }));
            setIsJoined(true); // Mark as joined to hide join controls
        }
    };

    const startGame = () => {
        if (isHost) {
            ws.current.send(JSON.stringify({ type: 'start' }));
        }
    };

    const goToStartGame = () => {
        navigate('/startgame', { state: { ws: ws.current } });
      };
    

    return (
        <div>
            <div className="gameTitle">
                <h2>Mafia Uhh...</h2>
            </div>
            
            {!isJoined ? (
                <div>
                    <div class="limiter">
                        <div class="container-login100">
                            <div class="wrap-login100">
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                />
                                <div class="loginButton-wrap">
                                    <button class = "lgn-btn" onClick={handleJoinGame}>Join Game</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            ) : (
                <div>
                    <div class="limiter">
                        <div class="container-login100">
                            <div class="wrap-login100">
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