import mysql from "mysql2";

// Connexion temporaire pour créer la base de données si elle n'existe pas
const tempDb = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
});

tempDb.connect(err => {
    if (err) {
        console.error("Erreur de connexion au serveur MySQL :", err);
        return;
    }

    // Création de la base de données si elle n'existe pas
    tempDb.query("CREATE DATABASE IF NOT EXISTS flappy_bird", (err) => {
        if (err) {
            console.error("Erreur lors de la création de la base de données :", err);
        } else {
            console.log("Base de données 'flappy_bird' créée avec succès !");
        }
        tempDb.end(); // Fermeture de la connexion temporaire une fois la BDD créée
    });
});

// Création de la connexion principale une fois la BDD créée
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "flappy_bird"
});

db.connect(err => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err);
        return;
    }
    console.log("Connexion réussie à la base de données !");
});

// Création de la table 'utilisateur' si elle n'existe pas
const createTableUser = `
CREATE TABLE IF NOT EXISTS utilisateur (
    id_u INT AUTO_INCREMENT PRIMARY KEY,
    nom_u VARCHAR(50) NOT NULL,
    prenom_u VARCHAR(50) NOT NULL,
    identifiant_u VARCHAR(50) UNIQUE NOT NULL,
    mdp_u VARCHAR(255) NOT NULL
);
`;

db.query(createTableUser, (err) => {
    if (err) {
        console.error("Erreur lors de la création de la table 'utilisateur' :", err);
    } else {
        console.log("Table 'utilisateur' créée avec succès !");
    }
});

const createTableScore = `
CREATE TABLE IF NOT EXISTS score (
    id_score INT AUTO_INCREMENT PRIMARY KEY,
    id_u INT,
    score_u INT DEFAULT 0,
    FOREIGN KEY (id_u) REFERENCES utilisateur(id_u)
);

`;

db.query(createTableScore, (err) => {
    if (err) {
        console.error("Erreur lors de la création de la table 'score' :", err);
    } else {
        console.log("Table 'score' créée avec succès !");
    }
});




export default db;
