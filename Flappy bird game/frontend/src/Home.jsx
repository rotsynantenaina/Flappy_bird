import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; //Pour naviguer
import styles from "./styles/styleHome.module.css"; // Import du fichier CSS

function Home() {
  const navigate = useNavigate();

  const handleQuit = () => {
    // Redirige l'utilisateur vers la page d'accueil ou une autre page
    navigate("/");
  };

  const userId = localStorage.getItem("userId");
    console.log("User ID récupéré dans Home :", userId);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("User ID récupéré dans Home :", userId);
}, []);


  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>FLAPPY BIRD</h1>
      <p className={styles.description}>Prêt à jouer ?</p>
      <img src="/images/birds.png" alt="Ciel" className={styles.birds} />
      <button className={styles.gameBtn} onClick={() => navigate("/components/game")}>
        <img src="/images/gameBtn.png" className={styles.gameBtn} alt="Oiseau" title="Commencer une partie" />
      </button>

      {/* Ajout du bouton "Quitter" */}
      <button className={styles.quitBtn} onClick={handleQuit}>
        Quitter le jeux
      </button>

     
    </div>
  );
}

export default Home;
