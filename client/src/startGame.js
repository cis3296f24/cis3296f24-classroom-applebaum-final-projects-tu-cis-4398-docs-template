import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';                    // imports the custom hook
import RoleDisplay from './roleDisplay';
import { useLocation, useNavigate } from 'react-router-dom';
import "./startGame.css"

function StartGame() {
  const ws = useWebSocket();                                                      // gets the WebSocket instance and connection status
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);                                     // uses state to store the player list for voting
  const [voting, setVoting] = useState(false);                                    // uses state to determine when voting occurs
  const [votes, setVotes] = useState({});                                         // uses state to store a player's vote
  const [rolesList, setRolesList] = useState([]);                                 // uses state to store the entire roles list
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);                 // uses state to store a list of eliminated players
  const [isEliminatedListVisible, setIsEliminatedListVisible] = useState(false);  // uses state to toggle eliminated players list visibility
  const [alivePlayers, setAlivePlayers] = useState([]);
  const [isAliveListVisible, setIsAliveListVisible] = useState(false);            // uses state to toggle alive players list visibility
  const [isDay, setIsDay] = useState(true);                                       // uses state to store whether it is night or day game phase
  const [timeLeft, setTimeLeft] = useState(20);                                   // starting timer value (defaults as 10 seconds)

  const[isNarrating, setNarrating] = useState(false);

  const location = useLocation();
  const { role, playerName, isHost } = location.state;

  const navigate = useNavigate();                                       // Hook for navigation



  // Listen for messages from the WebSocket (and update state)
  useEffect(() => {
    if (!ws) {
      console.log("WebSocket is not initialized");
      return;
    }else if(ws){
      if(!voting){
        ws.send(JSON.stringify({ type: 'startVote'}));                 // immediately after the start button is clicked, this sends the 'startVote' tag to the backend to activate the voting phase
      }
      const handleMessage = (event) => {
          console.log("event!");
          const data = JSON.parse(event.data);
          if (data.type === 'rolesList') {
              setRolesList(data.roleDesc);                                                        // changes the roles list to match the roles descriptions as from mafiaParameter.js
          } else if (data.type === 'startVoting') {                                               // this is for the start button
              console.log("voting!");
              setVoting(true);                                                                    // turns on voting
              setPlayers(data.players);
              setVotes({});                                                                       // reset vote tally for players
          } else if (data.type === 'voteResults') {
              setEliminatedPlayers(prev => [...prev, data.eliminatedPlayer]);                     // adds the eliminated player to the array
              setAlivePlayers();
              setVoting(false);
              setIsActive(false);                                                                   // turns off voting (can be useful for next phase implementation)
              setMessages(prev => [...prev, data.message]); 
              setVotes({});                                                                       // reset vote tally for players
          } else if (data.type === 'voteTie') {
              setVoting(false);                                                                   // turns off voting
              setMessages(prev => [...prev, data.message]);    
              setIsActive(false);                                                            // reset vote tally for players
              setVotes({});
          } else if (data.type === 'NIGHT') {
            setVoting(false);                                                                   // turns off voting
            navigate('/Night', { state: {role, playerName, isHost} });                          //move to night page                                         // turns off voting                          
          
          } else if (data.type === 'gameOver') {
            setMessages(prev => [...prev, data.message]);
          }
      }

    ws.addEventListener('message', handleMessage)

    return () => {
            ws.removeEventListener('message', handleMessage);
    };

  }

  }, [ws, navigate, role, playerName, isHost, eliminatedPlayers, players, voting]); // Re-run the effect if WebSocket instance changes

  useEffect(() => {
    const newAlivePlayers = players.filter(player => !eliminatedPlayers.includes(player));
    setAlivePlayers(newAlivePlayers);
  }, [players, eliminatedPlayers]);

  useEffect(() => {                               // timer
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {                 // sets an interval that decreases the time every second
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      console.log(timeLeft);
    } else if (timeLeft === 0 || !isActive) {
      setNarrating(true);    
      clearInterval(timer); // Clear the interval when time reaches 0
      setIsActive(false);    // Stop the timer
    }

    return () => clearInterval(timer);            // cleanup interval on component unmount or when timer is inactive
  }, [isActive, timeLeft]);


  const startTimer = (time) => {
    setTimeLeft(time)
    setIsActive(true);
  };



  const voteForPlayer = (playerName) => {
    if (votes[playerName] || eliminatedPlayers.includes(playerName)) return;    // checks to see if a player already voted or dead; prevents a player voting more than once

    setVotes({ ...votes, [playerName]: true });                                 // stores the votes for players and sets whether they have voted to true

    ws.send(JSON.stringify({ type: 'vote', playerName: playerName }));          // sends the player's vote to the server
};

const phaseChange = () => {
    console.log("Phase change");
    if(isDay){
      ws.send(JSON.stringify({ type: 'changePhase', phase: 'NIGHT' }));         // change phase for all
    }else{
      ws.send(JSON.stringify({ type: 'changePhase', phase: 'DAY' }));           // change phase for all
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
      {role && <RoleDisplay role={role} />}


      {/* Voting Section */}
      {voting && !eliminatedPlayers.includes(playerName) && (
        <div>
          <h3>Vote to Eliminate a Player</h3>
          {players.map((player) => (
            <button
              key={player}
              onClick={() => voteForPlayer(player)}
              disabled={eliminatedPlayers.includes(player)}
            >
              {player}
            </button>
          ))}
        </div>
      )}

      <div className="playerListsButtonWrapper">
        {/* Toggle Button for Eliminated Players List */}
        <div className="elimPlayersListButtonWrapper">
          <button
            onClick={() => setIsEliminatedListVisible((prev) => !prev)}
            className={`elimPlayersListButton player-button ${isAliveListVisible ? "disabled" : ""}`}
            disabled={isAliveListVisible}
          >
            {isEliminatedListVisible ? "Hide Eliminated Players" : "Show Eliminated Players"}
          </button>
        </div>

        {/* Toggle Button for Alive Players List */}
        <div className="alivePlayersListButtonWrapper">
          <button
            onClick={() => setIsAliveListVisible((prev) => !prev)}
            className={`alivePlayersListButton player-button ${isEliminatedListVisible ? "disabled" : ""}`}
            disabled={isEliminatedListVisible}
          >
            {isAliveListVisible ? "Hide Alive Players" : "Show Alive Players"}
          </button>
        </div>
      </div>

      {/* Eliminated Players List Modal */}
      {isEliminatedListVisible && (
        <div className="elimPlayersList-overlay">
          <div className="elimPlayersList-modal">
            <h3>Eliminated Players:</h3>
            <div className="elimPlayers-list">
              {eliminatedPlayers.map((player, index) => (
                  <p key={index} className="elimPlayer-name">{player}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alive Players List Modal */}
      {isAliveListVisible && (
        <div className="alivePlayersList-overlay">
          <div className="alivePlayersList-modal">
            <h3>Alive Players:</h3>
            <div className="alivePlayers-list">
              {alivePlayers.map((player, index) => (
                  <p key={index} className="alivePlayer-name">{player}</p>
              ))}
            </div>
          </div>
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

