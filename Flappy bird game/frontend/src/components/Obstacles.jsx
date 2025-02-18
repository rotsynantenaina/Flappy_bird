import React, { useEffect } from "react";

const Obstacles = ({ setObstacles, obstacles, setGameOver, birdPosition, gameOver }) => {
  const obstacleSpeed = 5;
  const gameWidth = 600;
  const gameHeight = 500;
  const obstacleWidth = 50;
  const gapHeight = 300;

  useEffect(() => {
    const generateObstacle = () => {
      const topHeight = Math.random() * (gameHeight - gapHeight - 100);
      const bottomHeight = gameHeight - gapHeight - topHeight;
    
      return {
        left: gameWidth,
        top: topHeight,
        bottom: gameHeight - bottomHeight,
        width: obstacleWidth, // Définir la largeur de l'obstacle
        height: topHeight,    // Hauteur de la partie supérieure de l'obstacle
        passed: false,        // Si l'obstacle a été traversé
      };
    };
    

    const interval = setInterval(() => {
      if (!gameOver) { // Ne génère des obstacles que si le jeu n'est pas fini
        setObstacles((prev) => [
          ...prev.filter((ob) => ob.left > -obstacleWidth),
          generateObstacle(),
        ]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [gameOver, setObstacles]);

  useEffect(() => {
    const moveObstacles = setInterval(() => {
      if (!gameOver) { // Ne déplace les obstacles que si le jeu n'est pas fini
        setObstacles((prev) =>
          prev.map((ob) => ({ ...ob, left: ob.left - obstacleSpeed }))
        );
      }
    }, 50);

    return () => clearInterval(moveObstacles);
  }, [gameOver, setObstacles]);

  
  useEffect(() => {
    obstacles.forEach((obstacle) => {
      // Position de l'oiseau
      const birdLeft = 80; // Position X fixe de l'oiseau
      const birdSize = 100; // Taille de l'oiseau (largeur et hauteur)
      const birdRight = birdLeft + birdSize;
      const birdBottom = birdPosition + birdSize;
      const birdTop = birdPosition;

      // Vérifie si l'oiseau est dans la zone X de l'obstacle
      const isBirdInXRange = 
        obstacle.left <= birdRight - 50 && // Réduire la zone de collision horizontale
        obstacle.left + obstacle.width >= birdLeft + 50; // Réduire la zone de collision horizontale

      // Vérifie la collision avec le haut de l'obstacle
      const isBirdCollidingWithTop = 
        birdBottom > obstacle.top + 20 && // Ajouter une marge de tolérance
        birdTop < obstacle.top + obstacle.height - 20; // Ajouter une marge de tolérance

      // Vérifie la collision avec le bas de l'obstacle
      const isBirdCollidingWithBottom = 
        birdTop < obstacle.bottom - 20 && // Ajouter une marge de tolérance
        birdBottom > obstacle.bottom + 20; // Ajouter une marge de tolérance

      // Vérifie si l'oiseau atteint le bas du jeu
      const isBirdFalling = birdBottom >= gameHeight;

      // Logs pour le débogage
      if (isBirdInXRange) {
        console.log('Collision Debug:', {
          birdLeft,
          birdRight,
          birdTop,
          birdBottom,
          obstacleLeft: obstacle.left,
          obstacleRight: obstacle.left + obstacle.width,
          obstacleTop: obstacle.top,
          obstacleBottom: obstacle.bottom,
          isBirdInXRange,
          isBirdCollidingWithTop,
          isBirdCollidingWithBottom
        });
      }

      // Si l'oiseau touche un obstacle ou tombe au sol
      if (
        (isBirdInXRange && (isBirdCollidingWithTop || isBirdCollidingWithBottom)) || 
        isBirdFalling
      ) {
        console.log('Game Over - Collision détectée');
        setGameOver(true);
      }
    });
  }, [obstacles, birdPosition, setGameOver]);



  return (
    <>
      {obstacles.map((obstacle, index) => (
        <div key={index}>
          <div
            style={{
              position: "absolute",
              left: `${obstacle.left}px`,
              top: "0px",
              width: `${obstacleWidth}px`,
              height: `${obstacle.top}px`,
              backgroundColor: "green",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${obstacle.left}px`,
              top: `${obstacle.bottom}px`,
              width: `${obstacleWidth}px`,
              height: `${gameHeight - obstacle.bottom}px`,
              backgroundColor: "green",
            }}
          />
        </div>
      ))}
    </>
  );
};

export default Obstacles;
