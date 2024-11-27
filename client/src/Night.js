import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';                                // Import the custom hook
import RoleDisplay from './roleDisplay';
import { useLocation, useNavigate } from 'react-router-dom';

function Night() {
  const ws = useWebSocket();                                                      // Get the WebSocket instance and connection status
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);                                     // uses state to store the player list for voting
  const [voting, setVoting] = useState(false);                                    // uses state to determine when voting occurs
  const [votes, setVotes] = useState({});                                         // uses state to store a player's vote
  const [rolesList, setRolesList] = useState([]);                                 // uses state to store the entire roles list
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);                 // uses state to store a list of eliminated players
  const [isEliminatedListVisible, setIsEliminatedListVisible] = useState(false);  // uses state to toggle eliminated players list visibility
  const [alivePlayers, setAlivePlayers] = useState([]);                           // uses state to store a list of alive players
  const [isAliveListVisible, setIsAliveListVisible] = useState(false);            // uses state to toggle alive players list visibility
  const [timeLeft, setTimeLeft] = useState(10);                                   // Starting timer value
  const [finalVote, setFinalVote] = useState(null);                               // uses state to store the final vote of each user

  const[isNarrating, setNarrating] = useState(false);

  const location = useLocation();
  const { role, playerName, isHost, nightLength } = location.state;               // includes nightLength within the page state 

  const navigate = useNavigate();                                                 // Hook for navigation

  const[spoke, setSpoke] = useState(true);

  useEffect(() => {                                                               // listens for messages from the WebSocket (and update state)
    if (!ws) {
      console.log("WebSocket is not initialized");
      return;
    } else if (ws) {  
      if (!voting) {
        ws.send(JSON.stringify({ type: 'startVote'}));
      }
      const handleMessage = (event) => {
        console.log("event!");
        const data = JSON.parse(event.data);

        if (data.type === 'rolesList') {
            setRolesList(data.roleDesc);
        } else if (data.type === 'startVoting') {
            console.log("voting!");
            setVoting(true);                                                                  // turns on voting
            ws.send(JSON.stringify({ type: 'beginNightTimer', nightLength: nightLength }));   // sends the nightLength value to the backend and to begin the timer
            setPlayers(data.players);
            setVotes({});                                                                     // reset vote tally for players
        } else if (data.type === 'voteResults') {
            setEliminatedPlayers(prev => [...prev, data.eliminatedPlayer]);                   // adds the new eliminated player to the eliminatedPlayers array
            setAlivePlayers();                                                                // resets the alive players array
            setVoting(false);                                                                 // turns off voting                                                                  
            setMessages(prev => [...prev, data.message]);
            setVotes({});                                                                     // reset vote tally for players
        } else if (data.type === 'voteTie') {
            setVoting(false);                                                                 // turns off voting
            setMessages(prev => [...prev, data.message]);                                   
            setVotes({});                                                                     // reset vote tally for players                          
        } else if (data.type === 'timer') {
            setTimeLeft(data.timeLeft);                                                       // sets the local timer based on the server timer
            console.log("RECEIVED TIMER: " + data.timeLeft);                                  // debugging
        } else if (data.type === 'phase') {
            if (data.phase === 'DAY') {                                                       // looks for the phase tag, and will change or stay on the page based on that
              setVoting(false);                                                               // turns off voting 
              navigate('/startGame', { state: { role, playerName, isHost, nightLength } });   // navigates to the startGame.js page (transfers the values within the state to the next page)                                                          
            }
        } else if (data.type === 'gameOver') {
          setMessages(prev => [...prev, data.message]);
        }
      }
      ws.addEventListener('message', handleMessage)

      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws, navigate, role, playerName, isHost, voting, nightLength]);                        // Re-run the effect if WebSocket instance changes

  useEffect(() => {
    const newAlivePlayers = players.filter(player => !eliminatedPlayers.includes(player));
    setAlivePlayers(newAlivePlayers);
  }, [players, eliminatedPlayers]);

  const voteForPlayer = (playerName) => {
    if (votes[playerName] || eliminatedPlayers.includes(playerName)) return;                // checks to see if a player already voted or dead; prevents a player voting more than once

    setVotes({ ...votes, [playerName]: true });                                             // stores the votes for players and sets whether they have voted to true

    ws.send(JSON.stringify({ type: 'vote', playerName: playerName }));                      // sends the player's vote to the server
  };

  const announceMafiaVote = () => {
    if(!spoke){
      console.log("Speaking!");
      const messageText = "Mafia open your eyes to vote.";
      const utterance = new SpeechSynthesisUtterance(messageText);
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 1;
  
      // Start speaking the messages
      window.speechSynthesis.speak(utterance);
      setSpoke(true);
    }
  };

  return (
      <div>
      {!isNarrating && (
        <div className="startGameNight">
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
          
        {/* Voting Section */}
        {voting && !eliminatedPlayers.includes(playerName) && (
        <div>
            <h3>Vote to Eliminate a Player</h3>
            <div>
                {/* Player Buttons for voting */}
                {players.map((player) => (
                    <div key={player}>
                        <label>
                            <input
                                type="radio"                                  // circle button design for now
                                name="vote"
                                value={player}
                                onChange={() => setFinalVote(player)}         // changes the state of the final vote for the user
                                disabled={eliminatedPlayers.includes(player)} // eliminated players can't vote
                            />
                            {player}
                        </label>
                    </div>
                ))}
            </div>
            {/* Submit Vote Button */}
            <button
                onClick={() => {
                    if (finalVote) voteForPlayer(finalVote);                  // submits the player's vote through the voteForPlayer function
                }}
                disabled={!finalVote}                                         // button is disabled until a player is selected
            >
                Submit Vote
            </button>
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
                                      {/* COMMENTED OUT THE CONTINUE BUTTON FOR NOW */}
                                      {/*<div className="glow">
                                            {isHost && <button onClick={phaseChange}>Continue</button>}
                                        </div>*/}
            </div>
        )}
        </div>
  );
}

export default Night;