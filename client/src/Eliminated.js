import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Eliminated.css';

function Eliminated() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eliminationMessage } = location.state;

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