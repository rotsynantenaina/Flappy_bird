import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import session from 'express-session';
import db from './db.js'; // Connexion à la base de données
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
console.log(jwtSecret);

const app = express();
app.use(express.json());
app.use(cors());

// Configuration de la session
app.use(session({
  secret: jwtSecret,
  resave: false,
  saveUninitialized: false, // Change `true` à `false` pour éviter les sessions inutiles
  cookie: {
      secure: false, // Met `true` si tu es en HTTPS
      httpOnly: true, // Sécurise les cookies
      sameSite: 'lax' // Change à `none` si tu es en HTTPS
  }
}));

app.options('*', cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


// Route pour l'inscription
app.post('/register', (req, res) => {
  const sql = 'INSERT INTO utilisateur (nom_u, prenom_u, identifiant_u, mdp_u) VALUES (?)';

  bcrypt.hash(req.body.mdp_u, 10, (err, hash) => {
    if (err) return res.status(500).json(err);

    const values = [req.body.nom_u, req.body.prenom_u, req.body.identifiant_u, hash];

    db.query(sql, [values], (err) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({ message: 'Inscription réussie ! Connectez-vous' });
    });
  });
});

// Route pour la connexion
  app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM utilisateur WHERE identifiant_u = ?';
  
    db.query(sql, [req.body.identifiant_u], (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' });
  
      bcrypt.compare(req.body.mdp_u, results[0].mdp_u, (err, valid) => {
        if (err) return res.status(500).json(err);
        if (!valid) return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' });
  
        // Stocke l'ID utilisateur dans la session
        req.session.userId = results[0].id_u;
        console.log("Utilisateur connecté, ID stocké dans la session:", req.session.userId);
  
        // Vérification : est-ce que l'ID existe ?
        if (!results[0].id_u) {
          console.error("Erreur: id_u est undefined !");
        }
  
        // Envoie aussi l'ID dans la réponse
        return res.status(200).json({ 
          message: 'Connexion réussie',
          id_u: results[0].id_u
        });
      });
    });
  });

// Route pour récupérer les informations de l'utilisateur connecté
app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  const sql = 'SELECT * FROM utilisateur WHERE id_u = ?';

  db.query(sql, [req.session.userId], (err, results) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ user: results[0] });
  });
});

// Route pour déconnecter l'utilisateur
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    return res.status(200).json({ message: 'Déconnexion réussie' });
  });
});




app.post("/saveScore", (req, res) => {
  const { score, userId } = req.body;

  if (!userId || score === null) {
    return res.status(400).json({ message: "Score ou ID utilisateur invalide" });
  }

  // Vérifier si le dernier score enregistré est déjà identique
  const checkSql = "SELECT score_u FROM score WHERE id_u = ? ORDER BY id_score DESC LIMIT 1";
  db.query(checkSql, [userId], (err, result) => {
    if (err) {
      console.error("Erreur lors de la vérification du score :", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    // Si le dernier score est déjà identique, ne pas enregistrer à nouveau
    if (result.length > 0 && result[0].score_u === score) {
      return res.status(200).json({ message: "Score déjà enregistré" });
    }

    // Insérer le score uniquement si c'est un nouveau
    const insertSql = "INSERT INTO score (id_u, score_u) VALUES (?, ?)";
    db.query(insertSql, [userId, score], (err, result) => {
      if (err) {
        console.error("Erreur lors de l'enregistrement du score :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.status(201).json({ message: "Score enregistré avec succès dans le back" });
    });
  });
});


app.get("/getScore/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = "SELECT MAX(score_u) AS score FROM score WHERE id_u = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération du score :", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    if (result.length === 0 || result[0].score === null) {
      return res.status(404).json({ message: "Aucun score trouvé" });
    }
    res.status(200).json({ score: result[0].score });
  });
});






app.listen(5000, () => {
  console.log('Serveur démarré sur le port 5000');
});
