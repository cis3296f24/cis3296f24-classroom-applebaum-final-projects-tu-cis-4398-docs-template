import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext'; // Import the custom hook
import RoleDisplay from './roleDisplay';
import { useLocation, useNavigate } from 'react-router-dom';

function StartGame() {
  const ws = useWebSocket(); // Get the WebSocket instance and connection status
  const [messages, setMessages] = useState([]);
         // uses state to store the player list for voting
  const [voting, setVoting] = useState(false);        // uses state to determine when voting occurs
  const [votes, setVotes] = useState({});             // uses state to store a player's vote
  const [rolesList, setRolesList] = useState([]);     // uses state to store the entire roles list
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);
  const [players, setPlayers] = useState([]);         // uses state to store the player list for voting
  const [isDay, setIsDay] = useState(true);

  const [timeLeft, setTimeLeft] = useState(20); // Starting timer value
  const [isActive, setIsActive] = useState(true);

  const[isNarrating, setNarrating] = useState(false);

  const location = useLocation();
  const { role, playerName, isHost } = location.state;

  const navigate = useNavigate(); // Hook for navigation



  // Listen for messages from the WebSocket (and update state)
  useEffect(() => {
    if (!ws) {
      console.log("WebSocket is not initialized");
      return;
    }else if(ws){
      if(!voting){
        ws.send(JSON.stringify({ type: 'startVote'}));
      }
      const handleMessage = (event) => {
          console.log("event!");
          const data = JSON.parse(event.data);
          if (data.type === 'rolesList') {
              setRolesList(data.roleDesc);
          } else if (data.type === 'startVoting') {
              console.log("voting!");
              setVoting(true);                                                                    // turns on voting
              setPlayers(data.players);
              setVotes({});                                                                       // reset vote tally for players
          } else if (data.type === 'voteResults') {
              setEliminatedPlayers(prev => [...prev, data.eliminatedPlayer]);                     // adds the eliminated player to the array
              setVoting(false);
              setIsActive(false);                                                                   // turns off voting (can be useful for next phase implementation)
              setMessages(prev => [...prev, `${data.eliminatedPlayer} has been eliminated!`]);
              setVotes({});                                                                       // reset vote tally for players
          } else if (data.type === 'voteTie') {
              setVoting(false);                                                                   // turns off voting
              setMessages(prev => [...prev, data.message]);                                       // reset vote tally for players
              setVotes({});
          } else if (data.type === 'NIGHT') {
            setVoting(false);                                                                   // turns off voting
            navigate('/Night', { state: {role, playerName, isHost} });                                                                   // turns off voting                          
          }
          setMessages((prevMessages) => [...prevMessages, data.message]); // Add new message
    }

    ws.addEventListener('message', handleMessage)

    return () => {
            ws.removeEventListener('message', handleMessage);
    };

  }

  }, [ws, navigate, role, playerName, isHost, eliminatedPlayers, players]); // Re-run the effect if WebSocket instance changes


//timer
  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      // Set an interval that decreases the time every second
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      console.log(timeLeft);
    } else if (timeLeft === 0 || !isActive) {
      setNarrating(true);
      clearInterval(timer); // Clear the interval when time reaches 0
      setIsActive(false);    // Stop the timer
    }

    // Cleanup interval on component unmount or when timer is inactive
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const startTimer = (time) => {
    setTimeLeft(time)
    setIsActive(true);
  };



  const voteForPlayer = (playerName) => {
    if (votes[playerName] || eliminatedPlayers.includes(playerName)) return;    // checks to see if a player already voted or dead; prevents a player voting more than once

    setVotes({ ...votes, [playerName]: true });                                 // stores the votes for players and sets whether they have voted to true

    ws.send(JSON.stringify({ type: 'vote', playerName: playerName }));  // sends the player's vote to the server
};

const phaseChange = () => {
  if(isHost){
    if(isDay){
      ws.send(JSON.stringify({ type: 'changePhase', phase: 'NIGHT' }));  // change phase for all
    }else{
      ws.send(JSON.stringify({ type: 'changePhase', phase: 'DAY' }));  // change phase for all
    }
  }
}

  return (
    <div>
    {!isNarrating && (
      <div className="startGameDay">
          <div className="gameTitle">
            <h2>MafiUhh...</h2>
          </div>
        {isHost && (
          <div className="user">
            Host
          </div>
        )}

        {/* Display the countdown timer */}
      <div className="timerWrapper">
        <div className="timer">
          <div className="timerNumber">{timeLeft}</div>
        </div>
      </div>

        {/* Display the user's role */}
        {role && (
            <RoleDisplay role={role}/>
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
                  
      </div>
      )}
      {isNarrating && (
        <div className="startGameNight">
          <div className="gameTitle">
            <h2>MafiUhh...</h2>
          </div>
          {/* Display the elimination messages after voting */}
        <div>
          {messages.length > 0 && (
            <div className="narration">
              <h3>Game Updates:</h3>
              <div>{messages.map((msg, index) => <p key={index}>{msg}</p>)}</div>
            </div>
          )}
        </div>
        <div className="glow">
                                        {isHost && <button onClick={phaseChange}>Continue</button>}
                                    </div>
        </div>
      )}
      </div>
  );
}

export default StartGame;

