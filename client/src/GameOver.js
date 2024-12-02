import { useLocation } from 'react-router-dom';
import './GameOver.css';

function GameOver() {
    const location = useLocation();
    const { gameOverMessage } = location.state
    
    return (
      <div className="gameOverPage">
        <div className="gameTitle">
          <h2>MafiUhh...</h2>
        </div>

        <div className="gameOverMessage">
            {gameOverMessage}
        </div>

      </div>
    );
  }
  
  export default GameOver;