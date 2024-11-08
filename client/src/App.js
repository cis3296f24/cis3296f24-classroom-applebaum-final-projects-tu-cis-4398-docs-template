import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Game from './Game';
import StartGame from './startGame';  // Import the StartGame component

function App() {
  return (
    <BrowserRouter basname="/app">
      <div class = "App">
        <Routes>
          <Route path="/" element={<Game />} /> {/* Game component is rendered at the root route */}
          <Route path="/startgame" element={<StartGame />} /> {/* StartGame component at the /startgame route */}
        </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
