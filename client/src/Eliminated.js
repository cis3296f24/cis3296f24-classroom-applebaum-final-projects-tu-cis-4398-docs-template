import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWebSocket } from './WebSocketContext';
import './Eliminated.css';

function Eliminated() {
  const ws = useWebSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { role, playerName, isHost, rolesList, dayLength, nightLength, eliminationMessage, currentPhase } = location.state;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPhase === 'DAY') {   // if it was day phase, navigate to night
        navigate('/Night', { state: {role, playerName, isHost, dayLength, nightLength, rolesList, eliminationMessage, currentPhase } });              
      } else if (currentPhase === 'NIGHT') {    // if it was night phase, navigate to day
        navigate('/StartGame', { state: {role, playerName, isHost, dayLength, nightLength, rolesList, eliminationMessage, currentPhase } });                  
      }
    }, 10000); // navigates to specified page after 10 seconds

    return () => clearTimeout(timer); // Clean up the timer
  }, [currentPhase, ws, nightLength, dayLength]);

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