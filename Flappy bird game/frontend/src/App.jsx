import { Routes, Route } from "react-router-dom";
import React from "react";

import Register from "./Register"; // ton composant de login/register

import Login from "./Login";
import Home from "./Home";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/components/game" element={<Game />} />
      <Route path="/components/gameOver" element={<GameOver />} />
      
    </Routes>
  );
}

export default App;