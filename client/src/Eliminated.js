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
      console.log(`Current phase: ${currentPhase}`);
      if (currentPhase === 'DAY') {
        console.log('Night Length: ' + nightLength);
        navigate('/Night', { state: {role, playerName, isHost, dayLength, nightLength, rolesList, eliminationMessage, currentPhase } });              
      } else if (currentPhase === 'NIGHT') {
        console.log('Day Length: ' + dayLength);
        navigate('/StartGame', { state: {role, playerName, isHost, dayLength, nightLength, rolesList, eliminationMessage, currentPhase } });                  
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); // Clean up the timer
    console.log('Timer cleared');
  }, [currentPhase, ws, nightLength, dayLength]);

  return (
    <div className="eliminatedPage">
      <h2>Elimination Results</h2>
      <div className="eliminatedContent">
        {eliminationMessage}
      </div>
    </div>
  );
}

export default Eliminated;