import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/styleGameOver.module.css"; // Réutilisation du CSS
import axios from "axios"; // Importation de Axios

const GameOver = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0; // Récupérer le score du state
  const userId = localStorage.getItem("userId");

    console.log("User ID récupéré :", userId);
    console.log("Score récupéré :", score);


    useEffect(() => {
        if (userId && score >= 0) { // Vérifier que les valeurs sont valides
          axios.post("http://localhost:5000/saveScore", {
            userId: userId,
            score: score
          })
          .then(response => {
            console.log("Score enregistré avec succès :", response.data);
          })
          .catch(error => {
            console.error("Erreur lors de l'enregistrement du score :", error);
          });
        } else {
          console.error("Impossible d'enregistrer le score : userId ou score invalide.");
        }
      }, [userId, score]);

/*
      useEffect(() => {
        const fetchScore = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/getScore/${userId}`);
            setScore(response.data.score);
          } catch (error) {
            console.error("Erreur lors de la récupération du score :", error);
          }
        };
    
        fetchScore();
      }, []);
*/
  return (
    <div className={styles.gameOver}>
      <h1 className={styles.title}>GAME OVER!</h1>
      <img src="/images/sad.png" className={styles.sad} alt="Game Over" />
      <p className={styles.description}>Votre score final: {score}</p>
      <button onClick={() => navigate("/")} className={styles.button}>
        Retour au menu
      </button>
      <button onClick={() => navigate("/components/game")} className={styles.button}>
        Rejouer
      </button>
    </div>
  );
};

export default GameOver;
