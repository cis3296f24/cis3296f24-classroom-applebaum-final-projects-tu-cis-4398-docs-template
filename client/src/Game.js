import React, { useState, useEffect, useRef } from 'react';

function Game() {
    const [isHost, setIsHost] = useState(false);
    const [messages, setMessages] = useState([]);
    const [role, setRole] = useState(null);
    const [playerName, setPlayerName] = useState(''); // State to store player name
    const [isJoined, setIsJoined] = useState(false); // Track if player has joined the game
    const ws = useRef(null);

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
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Game;