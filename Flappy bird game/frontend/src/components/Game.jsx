import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Bird from "./Bird";
import Obstacles from "./Obstacles";
import styles from "../styles/styleGame.module.css";

const Game = () => {
  const navigate = useNavigate();
  const [birdPosition, setBirdPosition] = useState(200);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [message, setMessage] = useState(""); // Message à afficher en fonction du score

  const gravity = 5;
  const jumpHeight = 50;
  const birdSize = 100;
  const birdX = 60;

  // Fonction pour faire sauter l'oiseau
  const jump = () => {
    setBirdPosition((prev) => Math.max(prev - jumpHeight, 0));
  };

  // Gestion du clavier pour le saut
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") jump();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Gravité de l'oiseau
  useEffect(() => {
    const interval = setInterval(() => {
      setBirdPosition((prev) => prev + gravity);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Vérification des collisions (sol et obstacles)
useEffect(() => {
    // Collision avec le sol
    if (birdPosition >= 550) {
      setGameOver(true);
      setFinalScore(score);
    }

    // Collision avec les obstacles
    obstacles.forEach((obstacle) => {
      // On ajoute un padding de 10px autour de l'oiseau
      const birdPadding = 0;
      const birdLeft = birdX + birdPadding; // Position de l'oiseau avec padding
      const birdRight = birdX + birdSize - birdPadding; // Position de l'oiseau avec padding

      const birdTop = birdPosition + birdPadding; // Position du haut de l'oiseau avec padding
      const birdBottom = birdPosition + birdSize - birdPadding; // Position du bas de l'oiseau avec padding

      // Vérifier la collision avec les obstacles
      if (
        obstacle.x < birdRight &&
        obstacle.x + obstacle.width > birdLeft &&
        birdBottom > obstacle.y &&
        birdTop < obstacle.y + obstacle.height - 100
      ) {
        setGameOver(true);
        setFinalScore(score);
      }
    });
  }, [birdPosition, obstacles, score]);


  // Redirection vers la page Game Over en cas de fin de jeu
  useEffect(() => {
    if (gameOver && finalScore !== null) {
      navigate('/components/gameOver', { state: { score: finalScore } });
      console.log("Score final : ", finalScore);
    }
  }, [gameOver, navigate, finalScore]);

  // Gestion du score
  useEffect(() => {
    if (!gameOver) {
      const scoreInterval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 3000);
      return () => clearInterval(scoreInterval);
    }
  }, [gameOver]);

  // Enregistrement du score dans la base de données après game over
  useEffect(() => {
    if (gameOver && finalScore !== null) {
      const saveScore = async () => {
        try {
          const response = await axios.post("http://localhost:5000/saveScore", { score: finalScore }, { withCredentials: true });
          console.log(response.data.message);
        } catch (error) {
          console.error("Erreur lors de l'enregistrement du score :", error.response?.data?.message || error.message);
        }
      };
      if(finalScore > 0){
        saveScore();
      }
    }
  }, [finalScore]);

  // Affichage des messages en fonction du score
  useEffect(() => {
    if (score >= 100) {
      setMessage("Vous êtes le meilleur !🏆");
    } else if (score >= 20) {
      setMessage("Wouah !😯");
    } else if (score >= 5) {
      setMessage("Pas mal !");
    } else {
      setMessage("");
    }
  }, [score]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>FLAPPY BIRD 🦜</h1>
      <p className={styles.description}>
        Aidez l'oiseau à voler le plus loin possible en tapant sur la barre <strong>espace</strong> en évitant les obstacles !
      </p>

      {!gameOver && <div className={styles.score}>Score: {score}</div>} {/* Affichage du score */}
      <div className={styles.message}>{message}</div> {/* Affichage du message selon le score */}

      <div className={styles.gameContainer}>
        <Bird position={birdPosition} />
        <Obstacles
          obstacles={obstacles}
          setObstacles={setObstacles}
          setGameOver={setGameOver}
          gameOver={gameOver}
          birdPosition={birdPosition}
        />
      </div>
    </div>
  );
};

export default Game;
