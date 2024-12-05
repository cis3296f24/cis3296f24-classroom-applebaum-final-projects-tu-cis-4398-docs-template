import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWebSocket } from './WebSocketContext';
import Elim from './Sounds/Elim.mp3';
import NoElim from './Sounds/NoElim.mp3';
import CloseEyes from './Sounds/CloseEyes.mp3';
import EndVote from './Sounds/EndVote.mp3';
import './Eliminated.css';

function Eliminated() {
  const ws = useWebSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { role, playerName, isHost, rolesList, dayLength, nightLength, eliminationMessage, currentPhase, elimination } = location.state;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPhase === 'DAY') {   // if it was day phase, navigate to night
        speak(CloseEyes);
        navigate('/Night', { state: {role, playerName, isHost, dayLength, nightLength, rolesList, eliminationMessage, currentPhase } });              
      } else if (currentPhase === 'NIGHT') {    // if it was night phase, navigate to day
        navigate('/StartGame', { state: {role, playerName, isHost, dayLength, nightLength, rolesList, eliminationMessage, currentPhase } });                  
      }
    }, 10000); // navigates to specified page after 10 seconds

    return () => clearTimeout(timer); // Clean up the timer
  }, [currentPhase, ws, nightLength, dayLength]);

  useEffect(() => {
    speak(EndVote);
    if(elimination){
      speak(Elim);
    }else{
      speak(NoElim);
    }
  });

  function speak(sound) {
    var audio = new Audio(sound);
    audio.volume = .2;  // Set the volume level (0.0 to 1.0)
    audio.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
   };

  useEffect(() => {
    const handleMessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'gameOver') {                                              // when gameOver data type is received, send player to game over screen
        navigate('/GameOver', { state: {gameOverMessage: data.message}});
        }
    }
    ws.addEventListener('message', handleMessage)

    return () => {
        ws.removeEventListener('message', handleMessage);
    };
});

  return (
    <div className="eliminatedPage">
      <div className="gameTitle">
        <h2>MafiUhh...</h2>
      </div>

      <div className="eliminatedHeader">
        <h2>Elimination Results</h2>
      </div>
      <div className="eliminatedContent">
        {eliminationMessage}
      </div>
    </div>
  );
}

export default Eliminated;