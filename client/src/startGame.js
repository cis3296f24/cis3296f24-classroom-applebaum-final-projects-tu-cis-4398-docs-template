import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';                    // imports the custom hook
import RoleDisplay from './roleDisplay';
import { useLocation } from 'react-router-dom';

function StartGame() {
  const ws = useWebSocket();                                          // gets the WebSocket instance and connection status
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);                         // uses state to store the player list for voting
  const [voting, setVoting] = useState(false);                        // uses state to determine when voting occurs
  const [votes, setVotes] = useState({});                             // uses state to store a player's vote
  const [rolesList, setRolesList] = useState([]);                     // uses state to store the entire roles list
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);     // uses state to store a list of eliminated players

  const [isDay, setIsDay] = useState(true);

  const [timeLeft, setTimeLeft] = useState(10);                       // starting timer value (defaults as 10 seconds)
  const [isActive, setIsActive] = useState(true);                     // sets the default timer state to true/active

  const location = useLocation();
  const { role, playerName, isHost } = location.state;

  useEffect(() => {                                                    // listens for messages from the WebSocket (and update state)
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
              setVoting(false);                                                                   // turns off voting (can be useful for next phase implementation)
              setMessages(prev => [...prev, data.message]); 
              setVotes({});                                                                       // reset vote tally for players
          } else if (data.type === 'voteTie') {
              setVoting(false);                                                                   // turns off voting
              setMessages(prev => [...prev, data.message]);                                       // reset vote tally for players
              setVotes({});
          } else if (data.type === 'NIGHT') {
              setVoting(false);                                                                     // turns off voting
              setIsDay(false);                                                                      // sets the page phase to nighttime
              startTimer(10);                                                                       
          } else if (data.type === 'DAY') {
              setVoting(false);                                                                     // turns off voting
              setIsDay(true); 
              startTimer(10);                              
          } else if (data.type === 'gameOver') {
            setMessages(prev => [...prev, data.message]);
          }
          //setMessages((prevMessages) => [...prevMessages, data.message]); <-- this line was sending duplicate messages to frontend, idk if it is needed or not?
    }

    ws.addEventListener('message', handleMessage)

    return () => {
            ws.removeEventListener('message', handleMessage);
    };

  }

  }, [ws]); // re-run the effect if WebSocket instance changes

  useEffect(() => {                               // timer
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {                 // sets an interval that decreases the time every second
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      console.log(timeLeft);
    } else if (timeLeft === 0) {
      phaseChange();
      clearInterval(timer);                       // clears the interval when time reaches 0
      setIsActive(false);                         // stops the timer
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
  if(isHost){
    if(isDay){
      ws.send(JSON.stringify({ type: 'changePhase', phase: 'NIGHT' }));         // change phase for all
    }else{
      ws.send(JSON.stringify({ type: 'changePhase', phase: 'DAY' }));           // change phase for all
    }
  }
}

  return (
    <div>
      {(isDay) &&
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
        {/* Display the elimination messages after voting */}
        <div>
          {messages.length > 0 && (
            <div>
              <h3>Game Updates:</h3>
              <div>{messages.map((msg, index) => <p key={index}>{msg}</p>)}</div>
            </div>
          )}
        </div>
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
      }

      {(!isDay) &&
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
              {/* Display the elimination messages after voting */}
              <div>
                {messages.length > 0 && (
                  <div>
                    <h3>Game Updates:</h3>
                    <div>{messages.map((msg, index) => <p key={index}>{msg}</p>)}</div>
                  </div>
                )}
              </div>
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
            }
    </div>
  );
}

export default StartGame;

